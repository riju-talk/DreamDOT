import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Server, Socket } from 'socket.io';
import { getUserId, verifyAuthToken } from '../auth/jwt.util';

interface AuthedSocket extends Socket {
  userId?: string;
}

@WebSocketGateway({
  path: process.env.SOCKET_PATH || '/socket.io',
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5000').split(','),
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(socket: AuthedSocket) {
    try {
      const token =
        (socket.handshake.auth?.token as string) ||
        (socket.handshake.query?.token as string)?.replace('Bearer ', '');

      if (!token) {
        throw new Error('No token provided');
      }

      const userId = getUserId(verifyAuthToken(token));
      socket.userId = userId;
      socket.join(`user:${userId}`);
      this.logger.log(`Socket connected for user ${userId}`);
    } catch (err) {
      this.logger.warn(`Socket auth failed: ${(err as Error).message}`);
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: AuthedSocket) {
    this.logger.log(`Socket disconnected: ${socket.userId ?? 'unauthenticated'}`);
  }

  pushToUser(userId: string, notification: unknown) {
    this.server.to(`user:${userId}`).emit('notification:new', notification);
  }
}
