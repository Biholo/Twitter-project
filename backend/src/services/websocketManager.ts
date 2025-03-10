import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import notificationService from './notificationService';
import { verifyToken } from '@/utils/jwt';

export class WebSocketManager {
  private wss: WebSocketServer;
  private notificationService: NotificationService;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.notificationService = notificationService;
    this.init();
  }

  private init(): void {
    this.wss.on('connection', async (ws: WebSocket, req) => {
      try {
        // Extraire et vérifier le token
        const token = this.extractToken(req);
        const userId = await this.authenticateConnection(token);

        // Ajouter le client aux connexions WebSocket
        this.notificationService.addClient(userId, ws);

        // Gérer la déconnexion
        ws.on('close', () => {
          this.notificationService.removeClient(userId, ws);
        });

        // Gérer les messages reçus
        ws.on('message', async (message: string) => {
          try {
            const data = JSON.parse(message);
            await this.handleMessage(userId, data);
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

  private extractToken(req: any): string {
    const token = req.url.split('token=')[1];
    if (!token) {
      throw new Error('Token manquant');
    }
    return token;
  }

  private async authenticateConnection(token: string): Promise<string> {
    try {
      const decoded = await verifyToken(token);
      return decoded.id;
    } catch (error) {
      throw new Error('Token invalide');
    }
  }

  private async handleMessage(userId: string, data: any): Promise<void> {
    // Gérer différents types de messages
    switch (data.type) {
      case 'READ_NOTIFICATION':
        await this.notificationService.markAsRead(data.notificationId);
        break;
      // Ajouter d'autres cas selon les besoins
    }
  }
}