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
  type: 'INBOUND' | 'OUTBOUND';
  createdAt: Date;
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE' | 'VIDEO' | 'AUDIO';
  seen: boolean;
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
