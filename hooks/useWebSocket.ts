// React Hook for WebSocket Integration
// Provides real-time functionality for threat intelligence and collaboration

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  RealTimeWebSocketClient, 
  WebSocketMessage, 
  ThreatUpdateMessage, 
  CollaborationMessage, 
  UserStatusMessage, 
  AlertCreatedMessage, 
  SystemNotificationMessage,
  getWebSocketClient,
  initializeWebSocket,
  cleanupWebSocket
} from '@/lib/websocket/realtime-client';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnClose?: boolean;
  maxReconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  client: RealTimeWebSocketClient | null;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'reconnecting';
  lastMessage: WebSocketMessage | null;
  error: Error | null;
  reconnectAttempts: number;
  
  // Methods
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: WebSocketMessage) => void;
  
  // Event handlers
  onThreatUpdate: (callback: (message: ThreatUpdateMessage) => void) => void;
  onCollaborationMessage: (callback: (message: CollaborationMessage) => void) => void;
  onUserStatus: (callback: (message: UserStatusMessage) => void) => void;
  onAlertCreated: (callback: (message: AlertCreatedMessage) => void) => void;
  onSystemNotification: (callback: (message: SystemNotificationMessage) => void) => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    reconnectOnClose = true,
    maxReconnectAttempts = 5
  } = options;

  const [client, setClient] = useState<RealTimeWebSocketClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const clientRef = useRef<RealTimeWebSocketClient | null>(null);
  const eventCleanupFunctions = useRef<(() => void)[]>([]);

  // Initialize WebSocket client
  useEffect(() => {
    const wsClient = getWebSocketClient();
    setClient(wsClient);
    clientRef.current = wsClient;

    if (autoConnect && wsClient) {
      wsClient.connect()
        .then(() => {
          setIsConnected(true);
          setConnectionStatus('connected');
          setError(null);
        })
        .catch((err) => {
          setError(err);
          setConnectionStatus('disconnected');
        });
    }

    return () => {
      // Cleanup all event listeners
      eventCleanupFunctions.current.forEach(cleanup => cleanup());
      eventCleanupFunctions.current = [];
      
      // Disconnect WebSocket
      if (wsClient) {
        wsClient.disconnect();
      }
    };
  }, [autoConnect]);

  // Monitor connection status
  useEffect(() => {
    if (client) {
      const status = client.getConnectionStatus();
      setIsConnected(status === 'connected');
      setConnectionStatus(status);
      setReconnectAttempts(client.getReconnectAttempts());
    }
  }, [client]);

  // Setup event listeners
  const onThreatUpdate = useCallback((callback: (message: ThreatUpdateMessage) => void) => {
    if (client) {
      const cleanup = client.onThreatUpdate(callback);
      eventCleanupFunctions.current.push(cleanup);
      return cleanup;
    }
    return () => {};
  }, [client]);

  const onCollaborationMessage = useCallback((callback: (message: CollaborationMessage) => void) => {
    if (client) {
      const cleanup = client.onCollaborationMessage(callback);
      eventCleanupFunctions.current.push(cleanup);
      return cleanup;
    }
    return () => {};
  }, [client]);

  const onUserStatus = useCallback((callback: (message: UserStatusMessage) => void) => {
    if (client) {
      const cleanup = client.onUserStatus(callback);
      eventCleanupFunctions.current.push(cleanup);
      return cleanup;
    }
    return () => {};
  }, [client]);

  const onAlertCreated = useCallback((callback: (message: AlertCreatedMessage) => void) => {
    if (client) {
      const cleanup = client.onAlertCreated(callback);
      eventCleanupFunctions.current.push(cleanup);
      return cleanup;
    }
    return () => {};
  }, [client]);

  const onSystemNotification = useCallback((callback: (message: SystemNotificationMessage) => void) => {
    if (client) {
      const cleanup = client.onSystemNotification(callback);
      eventCleanupFunctions.current.push(cleanup);
      return cleanup;
    }
    return () => {};
  }, [client]);

  // Message handling
  useEffect(() => {
    if (client) {
      const cleanup = client.onSystemNotification((message) => {
        setLastMessage(message);
      });
      eventCleanupFunctions.current.push(cleanup);
    }
  }, [client]);

  // Control methods
  const connect = useCallback(async () => {
    if (client) {
      try {
        setError(null);
        setConnectionStatus('connecting');
        await client.connect();
      } catch (err) {
        setError(err as Error);
        setConnectionStatus('disconnected');
      }
    }
  }, [client]);

  const disconnect = useCallback(() => {
    if (client) {
      client.disconnect();
      setIsConnected(false);
      setConnectionStatus('disconnected');
      setError(null);
    }
  }, [client]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (client && isConnected) {
      client.sendMessage(message);
    }
  }, [client, isConnected]);

  return {
    client,
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    onThreatUpdate,
    onCollaborationMessage,
    onUserStatus,
    onAlertCreated,
    onSystemNotification
  };
}

// Specialized hooks for specific use cases
export function useThreatIntelligence() {
  const {
    client,
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    onThreatUpdate,
    onCollaborationMessage,
    onUserStatus,
    onAlertCreated,
    onSystemNotification
  } = useWebSocket({ autoConnect: true });

  const [threats, setThreats] = useState<any[]>([]);
  const [subscribedThreats, setSubscribedThreats] = useState<Set<string>>(new Set());

  // Handle threat updates
  useEffect(() => {
    const cleanup = onThreatUpdate((message) => {
      if (message.data) {
        setThreats(prev => {
          const existing = prev.findIndex(t => t.id === message.data.id);
          if (existing >= 0) {
            // Update existing threat
            const updated = [...prev];
            updated[existing] = message.data;
            return updated;
          } else {
            // Add new threat
            return [...prev, message.data];
          }
        });

        // Update subscription status
        if (message.data.isSubscribed) {
          setSubscribedThreats(prev => new Set(prev).add(message.data.id));
        } else {
          setSubscribedThreats(prev => {
            const updated = new Set(prev);
            updated.delete(message.data.id);
            return updated;
          });
        }
      }
    });

    return cleanup;
  }, [onThreatUpdate]);

  const subscribeToThreat = useCallback((threatId: string) => {
    if (client) {
      client.sendThreatUpdate({
        id: threatId,
        name: '',
        source: '',
        type: 'malware',
        severity: 'medium',
        confidence: 0,
        description: '',
        indicators: { domains: [], ips: [], hashes: [], urls: [] },
        tags: [],
        isActive: false,
        isSubscribed: true
      });
    }
  }, [client]);

  const unsubscribeFromThreat = useCallback((threatId: string) => {
    if (client) {
      client.sendThreatUpdate({
        id: threatId,
        name: '',
        source: '',
        type: 'malware',
        severity: 'medium',
        confidence: 0,
        description: '',
        indicators: { domains: [], ips: [], hashes: [], urls: [] },
        tags: [],
        isActive: false,
        isSubscribed: false
      });
    }
  }, [client]);

  return {
    client,
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    reconnectAttempts,
    threats,
    subscribedThreats,
    subscribeToThreat,
    unsubscribeFromThreat,
    sendMessage,
    connect,
    disconnect
  };
}

export function useRealTimeCollaboration(sessionId?: string) {
  const {
    client,
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
    onThreatUpdate,
    onCollaborationMessage,
    onUserStatus,
    onAlertCreated,
    onSystemNotification
  } = useWebSocket({ autoConnect: true });

  const [messages, setMessages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<Map<string, 'online' | 'offline' | 'busy'>>(new Map());

  // Handle collaboration messages
  useEffect(() => {
    const cleanup = onCollaborationMessage((message) => {
      if (message.data && message.data.sessionId === sessionId) {
        setMessages(prev => [...prev, message.data]);
      }
    });

    return cleanup;
  }, [onCollaborationMessage, sessionId]);

  // Handle user status updates
  useEffect(() => {
    const cleanup = onUserStatus((message) => {
      if (message.data) {
        setUserStatus(prev => {
          const updated = new Map(prev);
          updated.set(message.data.userId, message.data.status);
          return updated;
        });

        // Update participants list
        if (message.data.sessionId === sessionId) {
          setParticipants(prev => {
            const existing = prev.findIndex(p => p.userId === message.data.userId);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = {
                userId: message.data.userId,
                userName: message.data.userName,
                status: message.data.status
              };
              return updated;
            } else {
              return [...prev, {
                userId: message.data.userId,
                userName: message.data.userName,
                status: message.data.status
              }];
            }
          });
        }
      }
    });

    return cleanup;
  }, [onUserStatus, sessionId]);

  const sendCollaborationMessage = useCallback((content: string, userId: string, userName: string) => {
    if (client && sessionId) {
      client.sendCollaborationMessage({
        id: `msg_${Date.now()}`,
        userId,
        userName,
        content,
        timestamp: new Date().toISOString(),
        sessionId
      });
    }
  }, [client, sessionId]);

  const updateUserStatus = useCallback((status: 'online' | 'offline' | 'busy', userId: string, userName: string) => {
    if (client) {
      client.sendUserStatus({
        userId,
        userName,
        status,
        lastSeen: new Date().toISOString()
      });
    }
  }, [client]);

  return {
    client,
    isConnected,
    connectionStatus,
    lastMessage,
    error,
    reconnectAttempts,
    messages,
    participants,
    userStatus,
    sendCollaborationMessage,
    updateUserStatus,
    sendMessage,
    connect,
    disconnect
  };
}
