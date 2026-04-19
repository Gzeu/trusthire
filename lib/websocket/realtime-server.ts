// Real-time WebSocket Server for TrustHire
// Handles real-time threat intelligence updates, collaboration sessions, and live notifications

import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';

export interface ClientConnection {
  id: string;
  ws: WebSocket;
  userId?: string;
  userName?: string;
  sessionId?: string;
  lastPing: number;
  subscriptions: Set<string>;
}

export interface ServerMessage {
  type: 'threat_update' | 'collaboration_message' | 'user_status' | 'alert_created' | 'system_notification';
  timestamp: string;
  data: any;
  sessionId?: string;
  userId?: string;
}

export class RealTimeWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, ClientConnection> = new Map();
  private sessions: Map<string, Set<string>> = new Map();
  private threatFeeds: any[] = [];
  private alertRules: any[] = [];

  constructor(private port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.setupEventHandlers();
    this.initializeMockData();
  }

  private setupEventHandlers(): void {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      this.handleConnection(ws, req);
    });

    this.wss.on('error', (error) => {
      console.error('WebSocket server error:', error);
    });

    // Cleanup disconnected clients
    setInterval(() => {
      this.cleanupDisconnectedClients();
    }, 30000); // Check every 30 seconds
    });

    // Broadcast threat updates periodically
    setInterval(() => {
      this.broadcastThreatUpdates();
    }, 60000); // Every minute

    // Ping clients to keep connections alive
    setInterval(() => {
      this.pingClients();
    }, 30000); // Every 30 seconds
  }

  private handleConnection(ws: WebSocket, req: IncomingMessage): void {
    const clientId = this.generateClientId();
    const url = new URL(req.url!, 'http://localhost');
    const userId = url.searchParams.get('userId');
    const sessionId = url.searchParams.get('sessionId');
    const userName = url.searchParams.get('userName');

    const client: ClientConnection = {
      id: clientId,
      ws,
      userId,
      userName,
      sessionId,
      lastPing: Date.now(),
      subscriptions: new Set()
    };

    this.clients.set(clientId, client);

    // Add client to session if provided
    if (sessionId) {
      if (!this.sessions.has(sessionId)) {
        this.sessions.set(sessionId, new Set());
      }
      this.sessions.get(sessionId)!.add(clientId);
    }

    console.log(`Client connected: ${clientId} (User: ${userName}, Session: ${sessionId})`);

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'system_notification',
      timestamp: new Date().toISOString(),
      data: {
        title: 'Connected to TrustHire Real-time',
        message: `Welcome ${userName || 'User'}! You are now connected to real-time updates.`,
        level: 'success',
        action: {
          type: 'refresh',
          label: 'Get Started'
        }
      }
    });

    // Notify other users in the same session
    if (sessionId && userName) {
      this.broadcastToSession(sessionId, clientId, {
        type: 'user_status',
        timestamp: new Date().toISOString(),
        data: {
          userId,
          userName,
          status: 'online',
          lastSeen: new Date().toISOString()
        }
      });
    }

    // Send initial data
    this.sendInitialData(clientId);
  }

  private sendInitialData(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Send current threat feeds
    this.sendToClient(clientId, {
      type: 'threat_update',
      timestamp: new Date().toISOString(),
      data: {
        threats: this.threatFeeds.slice(-10), // Last 10 threats
        total: this.threatFeeds.length
      }
    });

    // Send current session participants
    if (client.sessionId) {
      const participants = this.sessions.get(client.sessionId);
      if (participants) {
        const participantData = Array.from(participants)
          .map(id => this.clients.get(id))
          .filter(Boolean)
          .map(p => ({
            userId: p!.userId,
            userName: p!.userName,
            status: 'online'
          }));

        this.sendToClient(clientId, {
          type: 'user_status',
          timestamp: new Date().toISOString(),
          data: {
            participants: participantData,
            sessionId: client.sessionId
          }
        });
      }
    }
  }

  private handleMessage(clientId: string, message: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const parsedMessage: ServerMessage = JSON.parse(message);
      this.processMessage(clientId, parsedMessage);
    } catch (error) {
      console.error(`Failed to parse message from client ${clientId}:`, error);
    }
  }

  private processMessage(clientId: string, message: ServerMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'collaboration_message':
        this.handleCollaborationMessage(clientId, message);
        break;
      case 'user_status':
        this.handleUserStatus(clientId, message);
        break;
      case 'threat_update':
        this.handleThreatUpdate(clientId, message);
        break;
      case 'alert_created':
        this.handleAlertCreated(clientId, message);
        break;
      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  private handleCollaborationMessage(clientId: string, message: ServerMessage): void {
    const client = this.clients.get(clientId);
    if (!client || !client.sessionId) return;

    // Broadcast to all participants in the session
    this.broadcastToSession(client.sessionId, clientId, message);
  }

  private handleUserStatus(clientId: string, message: ServerMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Update client status
    if (message.data.status) {
      // Broadcast status change to session participants
      if (client.sessionId) {
        this.broadcastToSession(client.sessionId, clientId, {
          type: 'user_status',
          timestamp: new Date().toISOString(),
          data: {
            userId: client.userId,
            userName: client.userName,
            status: message.data.status,
            lastSeen: new Date().toISOString()
          }
        });
      }
    }
  }

  private handleThreatUpdate(clientId: string, message: ServerMessage): void {
    // Process threat subscription updates
    const client = this.clients.get(clientId);
    if (!client) return;

    if (message.data.subscribe) {
      if (message.data.threatId) {
        client.subscriptions.add(message.data.threatId);
      }
    } else if (message.data.unsubscribe) {
      if (message.data.threatId) {
        client.subscriptions.delete(message.data.threatId);
      }
    }
  }

  private handleAlertCreated(clientId: string, message: ServerMessage): void {
    // Store new alert rule
    this.alertRules.push({
      ...message.data,
      createdBy: client.userId,
      createdAt: new Date().toISOString()
    });

    // Broadcast to all subscribed clients
    this.broadcast({
      type: 'alert_created',
      timestamp: new Date().toISOString(),
      data: message.data
    });
  }

  private sendToClient(clientId: string, message: ServerMessage): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  private broadcast(message: ServerMessage, excludeClientId?: string): void {
    this.clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    });
  }

  private broadcastToSession(sessionId: string, excludeClientId: string, message: ServerMessage): void {
    const participants = this.sessions.get(sessionId);
    if (!participants) return;

    participants.forEach(clientId => {
      if (clientId !== excludeClientId) {
        this.sendToClient(clientId, message);
      }
    });
  }

  private broadcastThreatUpdates(): void {
    // Simulate real-time threat updates
    const newThreat = this.generateMockThreat();
    if (newThreat) {
      this.threatFeeds.push(newThreat);
      
      this.broadcast({
        type: 'threat_update',
        timestamp: new Date().toISOString(),
        data: newThreat
      });
    }
  }

  private pingClients(): void {
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        this.sendToClient(clientId, {
          type: 'system_notification',
          timestamp: new Date().toISOString(),
          data: {
            title: 'Ping',
            message: 'Connection check',
            level: 'info'
          }
        });
      }
    });
  }

  private cleanupDisconnectedClients(): void {
    this.clients.forEach((client, clientId) => {
      if (client.ws.readyState === WebSocket.CLOSED || 
          client.ws.readyState === WebSocket.CLOSING ||
          (Date.now() - client.lastPing) > 90000) { // 90 seconds timeout
        
        console.log(`Cleaning up disconnected client: ${clientId}`);
        
        // Remove from session
        if (client.sessionId) {
          const participants = this.sessions.get(client.sessionId);
          if (participants) {
            participants.delete(clientId);
            
            // Notify others in session
            this.broadcastToSession(client.sessionId, clientId, {
              type: 'user_status',
              timestamp: new Date().toISOString(),
              data: {
                userId: client.userId,
                userName: client.userName,
                status: 'offline',
                lastSeen: new Date().toISOString()
              }
            });
          }
        }
        
        this.clients.delete(clientId);
      }
    });
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMockThreat(): any {
    const threatTypes = ['malware', 'phishing', 'vulnerability', 'apt', 'ransomware'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const sources = ['MISP', 'VirusTotal', 'PhishTank', 'Custom Feed'];
    
    return {
      id: `threat_${Date.now()}`,
      name: `New Threat ${Math.floor(Math.random() * 1000)}`,
      source: sources[Math.floor(Math.random() * sources.length)],
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: Math.floor(Math.random() * 40) + 60,
      timestamp: new Date().toISOString(),
      description: 'Automatically generated threat for demonstration',
      tags: ['automated', 'demo'],
      isActive: true,
      isSubscribed: false
    };
  }

  private initializeMockData(): void {
    // Initialize with some mock threat data
    this.threatFeeds = [
      {
        id: 'threat_1',
        name: 'APT28 Campaign',
        source: 'MISP',
        type: 'apt',
        severity: 'critical',
        confidence: 95,
        timestamp: new Date().toISOString(),
        description: 'Advanced persistent threat targeting government organizations',
        tags: ['espionage', 'government'],
        isActive: true,
        isSubscribed: false
      },
      {
        id: 'threat_2',
        name: 'Ransomware Variant',
        source: 'VirusTotal',
        type: 'ransomware',
        severity: 'high',
        confidence: 88,
        timestamp: new Date().toISOString(),
        description: 'New ransomware variant targeting healthcare',
        tags: ['ransomware', 'healthcare'],
        isActive: true,
        isSubscribed: false
      }
    ];
  }

  // Public methods for external access
  getConnectedClients(): number {
    return this.clients.size;
  }

  getActiveSessions(): number {
    return this.sessions.size;
  }

  getSessionParticipants(sessionId: string): string[] {
    const participants = this.sessions.get(sessionId);
    return participants ? Array.from(participants) : [];
  }

  addThreatFeed(threat: any): void {
    this.threatFeeds.push(threat);
    this.broadcast({
      type: 'threat_update',
      timestamp: new Date().toISOString(),
      data: threat
    });
  }

  start(): void {
    console.log(`Starting WebSocket server on port ${this.port}`);
    this.wss.listen(this.port, () => {
      console.log(`WebSocket server listening on port ${this.port}`);
    });
  }

  stop(): void {
    console.log('Stopping WebSocket server');
    this.wss.close();
  }
}

// Singleton instance for server management
let wsServer: RealTimeWebSocketServer | null = null;

export function getWebSocketServer(): RealTimeWebSocketServer {
  if (!wsServer) {
    wsServer = new RealTimeWebSocketServer(parseInt(process.env.WS_PORT || '8080'));
  }
  return wsServer;
}

export function startWebSocketServer(): void {
  const server = getWebSocketServer();
  server.start();
}

export function stopWebSocketServer(): void {
  if (wsServer) {
    wsServer.stop();
    wsServer = null;
  }
}
