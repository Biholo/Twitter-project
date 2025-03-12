import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { extractTokenFromHeader, verifyToken } from '@/utils/jwt';
import userRepository from '@/repositories/userRepository';

declare global {
  var server: Server;
}

interface ConnectedUser {
  userId: string;
  username: string;
  identifier_name: string;
  avatar: string;
  connections: WebSocket[];
}

class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private wss: WebSocketServer | null = null;
  private connectedUsers: Map<string, ConnectedUser>;

  private constructor() {
    this.connectedUsers = new Map();
  }

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public initialize(server: Server): void {
    if (this.wss) return;
    
    this.wss = new WebSocketServer({ server });
    this.init();
  }

  private init(): void {
    if (!this.wss) return;

    this.wss.on('connection', async (ws: WebSocket, req) => {
      try {
        const token = this.extractToken(req);
        const decoded = await verifyToken(token);
        const user = await userRepository.findById(decoded.id);
        
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        const userInfo = {
          userId: user.id.toString(),
          username: user.username,
          identifier_name: user.identifier_name,
          avatar: user.avatar || ''
        };

        this.addUserConnection(userInfo, ws);
        
        ws.on('close', () => {
          this.removeUserConnection(userInfo.userId, ws);
        });
      } catch (error) {
        console.error('Erreur de connexion WebSocket:', error);
        ws.close();
      }
    });
  }

  private addUserConnection(user: Omit<ConnectedUser, 'connections'>, ws: WebSocket): void {
    if (!this.connectedUsers.has(user.userId)) {
      this.connectedUsers.set(user.userId, {
        ...user,
        connections: [ws]
      });
    } else {
      const existingUser = this.connectedUsers.get(user.userId);
      if (existingUser) {
        existingUser.connections.push(ws);
      }
    }
  }

  private removeUserConnection(userId: string, ws: WebSocket): void {
    const user = this.connectedUsers.get(userId);
    if (user) {
      user.connections = user.connections.filter(conn => conn !== ws);
      if (user.connections.length === 0) {
        this.connectedUsers.delete(userId);
      }
    }
  }

  public notifyUser(userId: string): void {
    const user = this.connectedUsers.get(userId);
    if (user && this.wss) {
      const message = JSON.stringify({
        type: 'NOTIFICATION',
        data: { timestamp: new Date().toISOString() }
      });

      user.connections.forEach(connection => {
        if (connection.readyState === WebSocket.OPEN) {
          connection.send(message);
        }
      });
    }
  }

  private extractToken(req: any): string {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');
    if (!token) {
      throw new Error('Token manquant');
    }
    return token;
  }
}

export default WebSocketManager.getInstance();