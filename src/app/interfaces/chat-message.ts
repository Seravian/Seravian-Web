import { MessageType } from './message-type.enum';
export interface ChatMessage {
  clientMessageId?: string | null;
  id: number ;
  content: string | null;
  timestampUtc: string;
  isAI: boolean;
  messageType?: MessageType;
}
