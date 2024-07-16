interface SendPushRequest {
  user_id: string;
  token: string;
  title: string;
  body: string;
  type: string;
  priority: string;
}

interface SendPushResponse {
  message: string;
}

export { SendPushRequest, SendPushResponse };
