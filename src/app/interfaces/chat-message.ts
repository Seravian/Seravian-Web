export interface ChatMessage {
  id?: number | null;
  isAi: boolean;
  content: string;
  timestampUtc: Date;
}
