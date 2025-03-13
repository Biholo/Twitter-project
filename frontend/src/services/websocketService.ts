import { queryClient } from "@/configs/queryClient";

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private messageHandlers: Map<string, Function[]> = new Map();

  constructor() {
    this.messageHandlers = new Map([
      ['NOTIFICATION', []],
      ['CONNECTED_USERS_UPDATE', []],
    ]);
  }

  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${import.meta.env.VITE_WS_URL}?token=${token}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connecté');
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Message WebSocket reçu:', message);

        // Invalidate notifications query when receiving a new notification
        if (message.type === 'NOTIFICATION') {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }

        const handlers = this.messageHandlers.get(message.type) || [];
        handlers.forEach(handler => handler(message.data));
      } catch (error) {
        console.error('Erreur lors du traitement du message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket déconnecté');
      this.attemptReconnect(token);
    };

    this.ws.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Tentative de reconnexion ${this.reconnectAttempts}...`);
        this.connect(token);
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  subscribe(type: string, handler: Function) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)?.push(handler);
  }

  unsubscribe(type: string, handler: Function) {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      this.messageHandlers.set(
        type,
        handlers.filter(h => h !== handler)
      );
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
