import { Content } from '@application/entities/content';
import { Notification } from '@application/entities/notification';
import { makeNotification } from '@test/factories/notification-factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { CancelNotification } from './cancel-notification';
import { CountRecipientNotifications } from './count-recipient-notifications';
import { NotificationNotFound } from './errors/notification-not-found';
import { GetRecipientNotifications } from './get-recipient-notifications';
import { SendNotification } from './send-notification';

describe('Get recipient notifications', () => {
  it('should be able to get recipient notifications', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();

    const getRecipientNotifications = new GetRecipientNotifications(
      notificationsRepository,
    );

    await notificationsRepository.create(
      makeNotification({
        recipientId: '1',
      }),
    );

    await notificationsRepository.create(
      makeNotification({
        recipientId: '1',
      }),
    );

    await notificationsRepository.create(
      makeNotification({
        recipientId: '2',
      }),
    );

    const { notifications } = await getRecipientNotifications.execute({
      recipientId: '1',
    });

    expect(notifications).toHaveLength(2);
    expect(notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ recipientId: '1' }),
        expect.objectContaining({ recipientId: '1' }),
      ]),
    );
  });
});
