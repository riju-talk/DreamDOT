import { Injectable, Logger } from '@nestjs/common';
// @repo/database-mongo is the shared, canonical Mongo layer — same package chat/payment/web use.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connectToDatabase, User } = require('@repo/database-mongo');
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

// 1:1 map to Mongo User.notifications.types{} — see docs/DATA_SCHEMA.md §1.1.
// "like" has no matching toggle in the current User schema, so it's intentionally
// left out of NOTIFICATION_TYPES rather than silently falling back to another toggle.
const TYPE_TO_PREFERENCE: Record<NotificationType, string> = {
  follow: 'newFollowers',
  item_purchase: 'itemPurchases',
  comment: 'comments',
  message: 'messages',
  live_stream: 'liveStreams',
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway
  ) {}

  async create(dto: CreateNotificationDto) {
    const allowed = await this.isEnabled(dto.userId, dto.type);
    if (!allowed) {
      this.logger.log(`Skipped "${dto.type}" notification for user ${dto.userId} — disabled in preferences`);
      return null;
    }

    const notification = await this.prisma.notifications.create({
      data: {
        user_id: dto.userId,
        notification_type: dto.type,
        notification_content: dto.content,
        is_read: false,
      },
    });

    this.gateway.pushToUser(dto.userId, notification);
    return notification;
  }

  async listForUser(userId: string, limit = 30) {
    return this.prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: Math.min(limit, 100),
    });
  }

  async markRead(userId: string, notificationId: string) {
    return this.prisma.notifications.updateMany({
      where: { notification_id: notificationId, user_id: userId },
      data: { is_read: true },
    });
  }

  private async isEnabled(userId: string, type: NotificationType): Promise<boolean> {
    try {
      await connectToDatabase();
      const user = await User.findById(userId).select('notifications').lean();
      const prefKey = TYPE_TO_PREFERENCE[type];
      const enabled = user?.notifications?.types?.[prefKey];
      // Mongo schema defaults every toggle to true — only an explicit `false` should suppress.
      return enabled !== false;
    } catch (err) {
      this.logger.warn(`Preference lookup failed for user ${userId}, defaulting to enabled: ${(err as Error).message}`);
      return true;
    }
  }
}
