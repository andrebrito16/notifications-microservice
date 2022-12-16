import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';
import { SendNotification } from './send-notification';

describe('Send notifications', () => {
  it('should be able to send a notification', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();

    const sendNotifications = new SendNotification(notificationsRepository);

    const { notification } = await sendNotifications.execute({
      content: 'Test new notification',
      category: 'Test',
      recipientId: '123',
    });

    expect(notificationsRepository.notifications).toHaveLength(1);
    expect(notificationsRepository.notifications[0]).toEqual(notification);
  });
});
