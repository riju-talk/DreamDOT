import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';

// Each type maps 1:1 to an existing toggle in the Mongo User.notifications.types{}
// preference object — see NotificationsService.TYPE_TO_PREFERENCE. A type with no
// matching toggle should not be added here without adding the toggle first.
export const NOTIFICATION_TYPES = ['follow', 'item_purchase', 'comment', 'message', 'live_stream'] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsIn(NOTIFICATION_TYPES)
  type!: NotificationType;

  @IsString()
  @MaxLength(500)
  content!: string;
}
