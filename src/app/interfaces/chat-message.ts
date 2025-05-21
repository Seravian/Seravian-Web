import { MessageType } from './message-type.enum';
export interface ChatMessage {
  clientMessageId?: string | null;
  id?: number | null;
  content: string | null;
  timestampUtc: Date;
  isAI: boolean;
  messageType?: MessageType;
}
