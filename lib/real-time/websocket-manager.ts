/**
 * Real-time WebSocket Manager
 * Handles real-time collaboration features
 */

export interface CollaborationEvent {
  type: 'review_assigned' | 'comment_added' | 'assessment_shared' | 'review_updated' | 'user_joined' | 'user_left';
  data: {
    assessmentId?: string;
    userId?: string;
    reviewId?: string;
    comment?: string;
    timestamp: string;
    metadata?: Record<string, any>;
  };
}

export interface WebSocketConnection {
  id: string;
  userId: string;
  socket: WebSocket;
  connectedAt: Date;
  lastActivity: Date;
  subscriptions: string[];
}

export interface NotificationPayload {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

class WebSocketManager {
  private connections: Map<string, WebSocketConnection> = new Map();
  private userConnections: Map<string, string[]> = new Map(); // userId -> connectionIds
  private assessmentSubscriptions: Map<string, string[]> = new Map(); // assessmentId -> connectionIds
  private eventHandlers: Map<string, ((event: CollaborationEvent) => void)[]> = new Map();

  constructor() {
    this.setupHeartbeat();
  }

  // Add new WebSocket connection
  addConnection(connectionId: string, userId: string, socket: WebSocket): void {
    const connection: WebSocketConnection = {
      id: connectionId,
      userId,
      socket,
      connectedAt: new Date(),
      lastActivity: new Date(),
      subscriptions: []
    };

    this.connections.set(connectionId, connection);
    
    // Track user connections
    const userConns = this.userConnections.get(userId) || [];
    userConns.push(connectionId);
    this.userConnections.set(userId, userConns);

    // Setup message handlers
    this.setupMessageHandlers(connection);

    // Send welcome message
    this.sendToConnection(connectionId, {
      type: 'connection_established',
      data: {
        connectionId,
        userId,
        timestamp: new Date().toISOString()
      }
    });

    console.log(`WebSocket connection added: ${connectionId} for user ${userId}`);
  }

  // Remove WebSocket connection
  removeConnection(connectionId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Remove from user connections
    const userConns = this.userConnections.get(connection.userId) || [];
    const updatedUserConns = userConns.filter(id => id !== connectionId);
    this.userConnections.set(connection.userId, updatedUserConns);

    // Remove from assessment subscriptions
    connection.subscriptions.forEach(assessmentId => {
      const assessmentConns = this.assessmentSubscriptions.get(assessmentId) || [];
      const updatedAssessmentConns = assessmentConns.filter(id => id !== connectionId);
      this.assessmentSubscriptions.set(assessmentId, updatedAssessmentConns);
    });

    // Remove connection
    this.connections.delete(connectionId);

    // Close socket
    try {
      connection.socket.close();
    } catch (error) {
      console.error('Error closing WebSocket:', error);
    }

    console.log(`WebSocket connection removed: ${connectionId}`);
  }

  // Subscribe to assessment updates
  subscribeToAssessment(connectionId: string, assessmentId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Add to connection subscriptions
    if (!connection.subscriptions.includes(assessmentId)) {
      connection.subscriptions.push(assessmentId);
    }

    // Add to assessment subscribers
    const subscribers = this.assessmentSubscriptions.get(assessmentId) || [];
    if (!subscribers.includes(connectionId)) {
      subscribers.push(connectionId);
      this.assessmentSubscriptions.set(assessmentId, subscribers);
    }

    // Update last activity
    connection.lastActivity = new Date();

    console.log(`Connection ${connectionId} subscribed to assessment ${assessmentId}`);
  }

  // Unsubscribe from assessment updates
  unsubscribeFromAssessment(connectionId: string, assessmentId: string): void {
    const connection = this.connections.get(connectionId);
    if (!connection) return;

    // Remove from connection subscriptions
    connection.subscriptions = connection.subscriptions.filter(id => id !== assessmentId);

    // Remove from assessment subscribers
    const subscribers = this.assessmentSubscriptions.get(assessmentId) || [];
    const updatedSubscribers = subscribers.filter(id => id !== connectionId);
    this.assessmentSubscriptions.set(assessmentId, updatedSubscribers);

    console.log(`Connection ${connectionId} unsubscribed from assessment ${assessmentId}`);
  }

  // Send message to specific connection
  sendToConnection(connectionId: string, message: any): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    try {
      connection.socket.send(JSON.stringify(message));
      connection.lastActivity = new Date();
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  // Send message to all connections of a user
  sendToUser(userId: string, message: any): number {
    const connectionIds = this.userConnections.get(userId) || [];
    let sentCount = 0;

    connectionIds.forEach(connectionId => {
      if (this.sendToConnection(connectionId, message)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  // Send message to all subscribers of an assessment
  sendToAssessment(assessmentId: string, message: any): number {
    const connectionIds = this.assessmentSubscriptions.get(assessmentId) || [];
    let sentCount = 0;

    connectionIds.forEach(connectionId => {
      if (this.sendToConnection(connectionId, message)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  // Broadcast message to all connections
  broadcast(message: any): number {
    let sentCount = 0;

    this.connections.forEach((connection, connectionId) => {
      if (this.sendToConnection(connectionId, message)) {
        sentCount++;
      }
    });

    return sentCount;
  }

  // Handle collaboration events
  async handleCollaborationEvents(socket: WebSocket): Promise<void> {
    // This method is called when a WebSocket connection is established
    // It handles real-time collaboration events
  }

  // Send notification
  sendNotification(userId: string, notification: NotificationPayload): boolean {
    const message = {
      type: 'notification',
      data: notification
    };

    return this.sendToUser(userId, message) > 0;
  }

  // Register event handler
  onEvent(eventType: string, handler: (event: CollaborationEvent) => void): void {
    const handlers = this.eventHandlers.get(eventType) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventType, handlers);
  }

  // Trigger event
  triggerEvent(event: CollaborationEvent): void {
    const handlers = this.eventHandlers.get(event.type) || [];
    
    handlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });

    // Broadcast to relevant subscribers
    if (event.data.assessmentId) {
      this.sendToAssessment(event.data.assessmentId, {
        type: 'collaboration_event',
        data: event
      });
    }
  }

  // Get connection statistics
  getStats(): {
    totalConnections: number;
    uniqueUsers: number;
    assessmentSubscriptions: number;
    averageConnectionsPerUser: number;
  } {
    const totalConnections = this.connections.size;
    const uniqueUsers = this.userConnections.size;
    const assessmentSubscriptions = Array.from(this.assessmentSubscriptions.values())
      .reduce((total, subscribers) => total + subscribers.length, 0);
    const averageConnectionsPerUser = uniqueUsers > 0 ? totalConnections / uniqueUsers : 0;

    return {
      totalConnections,
      uniqueUsers,
      assessmentSubscriptions,
      averageConnectionsPerUser
    };
  }

  // Clean up inactive connections
  cleanupInactiveConnections(): void {
    const now = new Date();
    const inactiveThreshold = 30 * 60 * 1000; // 30 minutes

    this.connections.forEach((connection, connectionId) => {
      const inactiveTime = now.getTime() - connection.lastActivity.getTime();
      
      if (inactiveTime > inactiveThreshold || connection.socket.readyState !== WebSocket.OPEN) {
        this.removeConnection(connectionId);
      }
    });
  }

  private setupMessageHandlers(connection: WebSocketConnection): void {
    connection.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string);
        this.handleMessage(connection, message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    connection.socket.onclose = () => {
      this.removeConnection(connection.id);
    };

    connection.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.removeConnection(connection.id);
    };
  }

  private handleMessage(connection: WebSocketConnection, message: any): void {
    const { type, data } = message;
    
    connection.lastActivity = new Date();

    switch (type) {
      case 'subscribe_assessment':
        if (data.assessmentId) {
          this.subscribeToAssessment(connection.id, data.assessmentId);
        }
        break;

      case 'unsubscribe_assessment':
        if (data.assessmentId) {
          this.unsubscribeFromAssessment(connection.id, data.assessmentId);
        }
        break;

      case 'heartbeat':
        // Heartbeat received, update last activity
        break;

      case 'collaboration_event':
        this.triggerEvent({
          type: data.eventType,
          data: {
            ...data,
            userId: connection.userId,
            timestamp: new Date().toISOString()
          }
        });
        break;

      default:
        console.log(`Unknown message type: ${type}`);
    }
  }

  private setupHeartbeat(): void {
    // Send heartbeat to all connections every 30 seconds
    setInterval(() => {
      this.connections.forEach((connection, connectionId) => {
        if (connection.socket.readyState === WebSocket.OPEN) {
          this.sendToConnection(connectionId, {
            type: 'heartbeat',
            data: { timestamp: new Date().toISOString() }
          });
        }
      });

      // Clean up inactive connections
      this.cleanupInactiveConnections();
    }, 30000);
  }
}

// Singleton instance
export const webSocketManager = new WebSocketManager();
export default WebSocketManager;
