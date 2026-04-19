// Real-time WebSocket Client for TrustHire
// Handles real-time threat intelligence updates, collaboration sessions, and live notifications

import { WebSocket } from 'ws';

export interface WebSocketMessage {
  type: 'threat_update' | 'collaboration_message' | 'user_status' | 'alert_created' | 'system_notification';
  timestamp: string;
  data: any;
  sessionId?: string;
  userId?: string;
}

export interface ThreatUpdateMessage extends WebSocketMessage {
  type: 'threat_update';
  data: {
    id: string;
    name: string;
    source: string;
    type: 'malware' | 'phishing' | 'vulnerability' | 'apt' | 'ransomware';
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    description: string;
    indicators: {
      domains: string[];
      ips: string[];
      hashes: string[];
      urls: string[];
    };
    tags: string[];
    isActive: boolean;
    isSubscribed: boolean;
  };
}

export interface CollaborationMessage extends WebSocketMessage {
  type: 'collaboration_message';
  data: {
    id: string;
    userId: string;
    userName: string;
    content: string;
    timestamp: string;
    sessionId: string;
  };
}

export interface UserStatusMessage extends WebSocketMessage {
  type: 'user_status';
  data: {
    userId: string;
    userName: string;
    status: 'online' | 'offline' | 'busy';
    lastSeen: string;
    sessionId?: string;
  };
}

export interface AlertCreatedMessage extends WebSocketMessage {
  type: 'alert_created';
  data: {
    id: string;
    name: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    isActive: boolean;
    createdBy: string;
    createdAt: string;
  };
}

export interface SystemNotificationMessage extends WebSocketMessage {
  type: 'system_notification';
  data: {
    title: string;
    message: string;
    level: 'info' | 'warning' | 'error' | 'success';
    action?: {
      type: 'link' | 'button' | 'refresh';
      label?: string;
      url?: string;
    };
  };
}

export class RealTimeWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: WebSocketMessage[] = [];
  private listeners: Map<string, ((message: WebSocketMessage) => void)[]> = new Map();

  constructor(private url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.flushMessageQueue();
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect();
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  private handleMessage(message: WebSocketMessage): void {
    const messageType = message.type;
    const messageListeners = this.listeners.get(messageType) || [];
    
    messageListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error(`Error in ${messageType} listener:`, error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  sendMessage(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  // Type-specific message senders
  sendThreatUpdate(threatData: ThreatUpdateMessage['data']): void {
    this.sendMessage({
      type: 'threat_update',
      timestamp: new Date().toISOString(),
      data: threatData
    } as ThreatUpdateMessage);
  }

  sendCollaborationMessage(messageData: CollaborationMessage['data']): void {
    this.sendMessage({
      type: 'collaboration_message',
      timestamp: new Date().toISOString(),
      data: messageData
    } as CollaborationMessage);
  }

  sendUserStatus(statusData: UserStatusMessage['data']): void {
    this.sendMessage({
      type: 'user_status',
      timestamp: new Date().toISOString(),
      data: statusData
    } as UserStatusMessage);
  }

  sendAlertCreated(alertData: AlertCreatedMessage['data']): void {
    this.sendMessage({
      type: 'alert_created',
      timestamp: new Date().toISOString(),
      data: alertData
    } as AlertCreatedMessage);
  }

  sendSystemNotification(notificationData: SystemNotificationMessage['data']): void {
    this.sendMessage({
      type: 'system_notification',
      timestamp: new Date().toISOString(),
      data: notificationData
    } as SystemNotificationMessage);
  }

  // Event listener management
  onThreatUpdate(listener: (message: ThreatUpdateMessage) => void): () => void {
    return this.addEventListener('threat_update', listener as (message: WebSocketMessage) => void);
  }

  onCollaborationMessage(listener: (message: CollaborationMessage) => void): () => void {
    return this.addEventListener('collaboration_message', listener as (message: WebSocketMessage) => void);
  }

  onUserStatus(listener: (message: UserStatusMessage) => void): () => void {
    return this.addEventListener('user_status', listener as (message: WebSocketMessage) => void);
  }

  onAlertCreated(listener: (message: AlertCreatedMessage) => void): () => void {
    return this.addEventListener('alert_created', listener as (message: WebSocketMessage) => void);
  }

  onSystemNotification(listener: (message: SystemNotificationMessage) => void): () => void {
    return this.addEventListener('system_notification', listener as (message: WebSocketMessage) => void);
  }

  private addEventListener(messageType: string, listener: (message: WebSocketMessage) => void): () => void {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, []);
    }
    
    const listeners = this.listeners.get(messageType)!;
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }

  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return this.reconnectAttempts > 0 ? 'reconnecting' : 'disconnected';
      default:
        return 'disconnected';
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.getConnectionStatus() === 'connected';
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

// Singleton instance for application-wide WebSocket management
let wsClient: RealTimeWebSocketClient | null = null;

export function getWebSocketClient(): RealTimeWebSocketClient {
  if (!wsClient) {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
    wsClient = new RealTimeWebSocketClient(wsUrl);
  }
  return wsClient;
}

export function initializeWebSocket(): Promise<void> {
  const client = getWebSocketClient();
  return client.connect();
}

export function cleanupWebSocket(): void {
  if (wsClient) {
    wsClient.disconnect();
    wsClient = null;
  }
}
