import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import notificationService from './notificationService';
import { verifyToken } from '@/utils/jwt';
import userRepository from '@/repositories/userRepository';

interface ConnectedUser {
  userId: string;
  username: string;
  identifier_name: string;
  avatar: string;
  connections: WebSocket[];
}

class WebSocketManager {
  private wss: WebSocketServer;
  private notificationService: any;
  private connectedUsers: Map<string, ConnectedUser>;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.notificationService = notificationService;
    this.connectedUsers = new Map();
    this.init();
  }

  private init(): void {
    this.wss.on('connection', async (ws: WebSocket, req) => {
      try {
        // Extraire et vérifier le token
        const token = this.extractToken(req);
        const user = await this.authenticateConnection(token);

        // Ajouter l'utilisateur aux connexions
        this.addUserConnection(user, ws);

        // Notifier tous les clients du changement de la liste des utilisateurs connectés
        this.broadcastConnectedUsers();

        // Gérer la déconnexion
        ws.on('close', () => {
          this.removeUserConnection(user.userId, ws);
          this.broadcastConnectedUsers();
        });

        // Gérer les messages reçus
        ws.on('message', async (message: string) => {
          try {
            const data = JSON.parse(message);
            await this.handleMessage(user.userId, data);
          } catch (error) {
            console.error('Erreur de traitement du message:', error);
          }
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

  private broadcastConnectedUsers(): void {
    const connectedUsers = Array.from(this.connectedUsers.values()).map(user => ({
      userId: user.userId,
      username: user.username,
      identifier_name: user.identifier_name,
      avatar: user.avatar
    }));

    const message = JSON.stringify({
      type: 'CONNECTED_USERS_UPDATE',
      data: connectedUsers
    });

    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  public getConnectedUsers(): Array<Omit<ConnectedUser, 'connections'>> {
    return Array.from(this.connectedUsers.values()).map(user => ({
      userId: user.userId,
      username: user.username,
      identifier_name: user.identifier_name,
      avatar: user.avatar
    }));
  }

  public isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  private extractToken(req: any): string {
    const token = req.url.split('token=')[1];
    if (!token) {
      throw new Error('Token manquant');
    }
    return token;
  }

  private async authenticateConnection(token: string): Promise<Omit<ConnectedUser, 'connections'>> {
    try {
      const decoded = await verifyToken(token);
      const user = await userRepository.findById(decoded.userId);
      
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return {
        userId: user.id.toString(),
        username: user.username,
        identifier_name: user.identifier_name,
        avatar: user.avatar || ''
      };
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  private async handleMessage(userId: string, data: any): Promise<void> {
    // Gérer différents types de messages
    switch (data.type) {
      case 'NEW_FOLLOWER':
          const newFollower = await this.notificationService.getNewFollower(data.userId);
        break;
      case 'LIKE':
        const like = await this.notificationService.getLike(data.userId);
        break;
      case 'RETWEET':
        const retweet = await this.notificationService.getRetweet(data.userId);
        break;
      case 'REPLY':
        const reply = await this.notificationService.getReply(data.userId);
        break;
      case 'MENTION':
        const mention = await this.notificationService.getMention(data.userId);
        break;        
    }
  }
}

export default WebSocketManager;