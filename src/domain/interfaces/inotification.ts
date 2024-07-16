import { SendMassRequest, SendSingleRequest } from "@/domain/types/mail";
import { SendPushRequest } from "@/domain/types/push";

export interface INotification {
  sendMailSingle(data: SendSingleRequest): Promise<void>;
  sendMailMass(data: SendMassRequest): Promise<void>;
  sendPush(data: SendPushRequest): Promise<void>;
}