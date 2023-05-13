import { describe, expect, test } from 'vitest';
import {
  type MessageItem,
  type DeepPartial,
  findMessageByPrompt,
  isInProgress,
} from '../src';

describe('findMessageByPrompt', () => {
  test('should return message with matching prompt and author id', () => {
    const messages: DeepPartial<MessageItem>[] = [
      { content: 'Hello', author: { id: '936929561302675456' } },
      { content: 'Hi', author: { id: '123456' } },
    ];
    const prompt = 'Hello';
    const result = findMessageByPrompt(messages as MessageItem[], prompt);
    expect(result).toEqual({
      content: 'Hello',
      author: { id: '936929561302675456' },
    });
  });

  test('should return undefined if prompt is not found in message content', () => {
    const messages: DeepPartial<MessageItem>[] = [
      { content: 'Hello', author: { id: '936929561302675456' } },
      { content: 'Hi', author: { id: '123456' } },
    ];
    const prompt = 'Hey';
    const result = findMessageByPrompt(messages as MessageItem[], prompt);
    expect(result).toEqual(undefined);
  });

  test('should return undefined if author id does not match', () => {
    const messages: DeepPartial<MessageItem>[] = [
      { content: 'Hello', author: { id: '123456' } },
      { content: 'Hi', author: { id: '789012' } },
    ];
    const prompt = 'Hello';
    const result = findMessageByPrompt(messages as MessageItem[], prompt);
    expect(result).toEqual(undefined);
  });
});

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
