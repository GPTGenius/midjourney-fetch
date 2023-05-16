import { type MessageItem } from './interface';

export const findMessageByPrompt = (
  messages: MessageItem[],
  prompt: string
) => {
  // trim and merge spaces
  const filterPrompt = prompt.split(' ').filter(Boolean).join(' ');
  return messages.find(
    (msg) =>
      msg.content.includes(filterPrompt) &&
      msg.author.id === '936929561302675456'
  );
};

export const isInProgress = (message: MessageItem) =>
  message.attachments.length === 0 ||
  (message.attachments[0]?.filename?.startsWith('grid') &&
    message.attachments[0]?.filename?.endsWith('.webp'));
