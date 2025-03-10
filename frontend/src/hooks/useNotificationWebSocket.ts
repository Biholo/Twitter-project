import { useEffect, useRef } from 'react';
import { useNotificationStore } from '@/stores';
import queryClient from '@/configs/queryClient';


// Vérification de la présence de la variable d'environnement
if (!import.meta.env.VITE_WS_URL) {
    throw new Error('La variable d\'environnement VITE_WS_URL est manquante');
}

export const useNotificationWebSocket = (token: string) => {
    const ws = useRef<WebSocket | null>(null);
    const { addNotification, updateNotification } = useNotificationStore();

    useEffect(() => {
        // Créer la connexion WebSocket
        ws.current = new WebSocket(`${import.meta.env.VITE_WS_URL}/ws?token=${token}`);

        ws.current.onopen = () => {
            console.log('WebSocket connecté');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);

            switch (data.type) {
                case 'NOTIFICATION':
                    addNotification(data.data);
                    // Invalider le cache des notifications
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    break;

                case 'NOTIFICATION_UPDATE':
                    updateNotification(data.notificationId, data.updates);
                    break;
            }
        };

        ws.current.onerror = (error) => {
            console.error('Erreur WebSocket:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket déconnecté');
        };

        // Nettoyage à la déconnexion
        return () => {
            ws.current?.close();
        };
    }, [token]);

    // Fonction pour marquer une notification comme lue
    const markAsRead = (notificationId: string) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({
                type: 'READ_NOTIFICATION',
                notificationId
            }));
        }
    };

    return { markAsRead };
};