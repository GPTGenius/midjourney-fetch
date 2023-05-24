import { describe, expect, test } from 'vitest';
import { type MessageItem, type DeepPartial, isInProgress } from '../src';

describe('isInProgress', () => {
  test('should return undefined if author id does not match', () => {
    const message: DeepPartial<MessageItem> = { attachments: [] };
    const result = isInProgress(message as MessageItem);
    expect(result).toEqual(true);
  });

  test('should return true if message has no attachments', () => {
    const message: DeepPartial<MessageItem> = {
      attachments: [{ filename: 'grid01.webp' }],
    };
    const result = isInProgress(message as MessageItem);
    expect(result).toEqual(true);
  });

  test('should return true if message has attachment with filename starting with "grid" and ending with ".webp"', () => {
    const message: DeepPartial<MessageItem> = {
      attachments: [{ filename: 'image.jpg' }],
    };
    const result = isInProgress(message as MessageItem);
    expect(result).toEqual(false);
  });
});
