export type Conversation = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userId: string;
  createdAt: string;
  lastActive: string;
};

export type Message = {
  id: string;
  type: 'INBOUND' | 'OUTBOUND';
  createdAt: string;
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO' | 'AUDIO';
  seen: boolean;
  conversationId?: string;
  local?: boolean;
};
export type FileData = {
  id: number;
  key: string;
  name: string;
  location: string;
  mimeType: string;
  size: number;
  clientId: string;
  messageId: number | null;
  createdAt: Date;
};
export type ResponsePayload<T> =
  | {
      status: 'error';
      message: string;
    }
  | {
      status: 'success';
      result: T;
    };
