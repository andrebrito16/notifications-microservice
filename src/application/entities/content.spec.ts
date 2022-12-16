import { Content } from './content';

describe('Notification content', () => {
  it('should be able to create a notification content', () => {
    const content = new Content('Test new notification');

    expect(content).toBeTruthy();
  });

  it('should not be able to crate a notification content with less than 5 characteres', () => {
    expect(() => new Content('a')).toThrow();
  });

  it('should not be able to crate a notification content with more than than 240 characteres', () => {
    expect(() => new Content('a'.repeat(241))).toThrow();
  });
});
