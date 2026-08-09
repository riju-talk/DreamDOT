import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ServiceAuthGuard } from '../auth/service-auth.guard';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  // Called by the signed-in user's own browser session
  @UseGuards(JwtAuthGuard)
  @Get('notifications')
  list(@Req() req: any, @Query('limit') limit?: string) {
    return this.notifications.listForUser(req.userId, limit ? parseInt(limit, 10) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('notifications/:id/read')
  markRead(@Req() req: any, @Param('id') id: string) {
    return this.notifications.markRead(req.userId, id);
  }

  // Called by other DreamDOT services (web API routes, chat, payment) — never by a browser
  @UseGuards(ServiceAuthGuard)
  @Post('internal/notifications')
  ingest(@Body() dto: CreateNotificationDto) {
    return this.notifications.create(dto);
  }
}
