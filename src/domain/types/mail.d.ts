// TypeScript types based on Protocol Buffers schema

// SendSingleRequest message type
interface SendSingleRequest {
  user_id: string
  name: string;
  to: string;
  subject: string;
  text?: string;
  options?: EmailOptions;
}

// SendSingleResponse message type
interface SendSingleResponse {
  message: string;
}

// SendMassRequest message type
interface SendMassRequest {
  user_id: string;
  name: string;
  to: string[];
  subject: string;
  text: string;
  options?: EmailOptions;
}

// SendMassResponse message type
interface SendMassResponse {
  message: string;
}

// Variable message type
interface Variable {
  name: string;
  value: string;
}

// EmailOptions message type
interface EmailOptions {
  template?: string;
  html?: string;
  variables?: Variable[];
}

export {
  SendSingleRequest,
  SendSingleResponse,
  SendMassRequest,
  SendMassResponse,
  Variable,
  EmailOptions,
};
