import { CancelNotification } from '@application/use-cases/cancel-notification';
import { CountRecipientNotifications } from '@application/use-cases/count-recipient-notifications';
import { GetRecipientNotifications } from '@application/use-cases/get-recipient-notifications';
import { ReadNotification } from '@application/use-cases/read-notification';
import { UnreadNotification } from '@application/use-cases/unread-notification';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SendNotification } from 'src/application/use-cases/send-notification';
import { CreateNotificationBody } from '../dtos/create-notification-body';
import { NotificationViewModel } from '../views-model/notification-view-model';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly sendNotification: SendNotification,
    private readonly cancelNotification: CancelNotification,
    private readonly readNotification: ReadNotification,
    private readonly unreadNotification: UnreadNotification,
    private readonly countRecipientNotifications: CountRecipientNotifications,
    private readonly getRecipientNotifications: GetRecipientNotifications,
  ) {}
  @Get('count/from/:recipientId')
  async countFromRecipient(
    @Body('recipientId', ParseUUIDPipe) recipientId: string,
  ) {
    const { count } = await this.countRecipientNotifications.execute({
      recipientId,
    });

    return count;
  }

  @Get('from/:recipientId')
  async getFromRecipient(
    @Body('recipientId', ParseUUIDPipe) recipientId: string,
  ) {
    const { notifications } = await this.getRecipientNotifications.execute({
      recipientId,
    });

    return {
      notifications: notifications.map(NotificationViewModel.toHTTP),
    };
  }

  @Patch(':id/read')
  async read(@Param('id', ParseUUIDPipe) id: string) {
    await this.readNotification.execute({
      notificationId: id,
    });
  }

  @Patch(':id/unread')
  async unread(@Param('id', ParseUUIDPipe) id: string) {
    await this.unreadNotification.execute({
      notificationId: id,
    });
  }

  @Patch(':id/cancel')
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    await this.cancelNotification.execute({
      notificationId: id,
    });
  }

  @Post()
  async create(@Body() body: CreateNotificationBody) {
    const { recipientId, content, category } = body;

    const { notification } = await this.sendNotification.execute({
      recipientId,
      content,
      category,
    });

    return { notification: NotificationViewModel.toHTTP(notification) };
  }
}
