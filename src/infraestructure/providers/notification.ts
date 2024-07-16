import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Client, ClientGrpc } from "@nestjs/microservices";
import { MailGrpcClientMethods, mailGrpcClientOptions } from "../clients/mail";
import { PushGrpcClientMethods, pushGrpcClientOptions } from "../clients/push";
import { SendMassRequest, SendSingleRequest } from "@/domain/types/mail";
import { SendPushRequest } from "@/domain/types/push";
import { INotification } from "@/domain/interfaces/inotification";
import { lastValueFrom } from "rxjs";

@Injectable()
export class NotificationProvider implements INotification, OnModuleInit {
  protected logger = new Logger('Notification');

  @Client(mailGrpcClientOptions)
  private mailClient: ClientGrpc;
  private mailService: MailGrpcClientMethods;

  @Client(pushGrpcClientOptions)
  private pushClient: ClientGrpc;
  private pushService: PushGrpcClientMethods;

  onModuleInit() {
    this.mailService = this.mailClient.getService('MailService');
    this.pushService = this.pushClient.getService('PushService');
  }

  async sendMailSingle(data: SendSingleRequest) {
    try {
      console.log(data)
      await lastValueFrom(this.mailService.SendSingle(data) as any);
    } catch (error) {
      console.log(error)
      this.logger.error('Send mail single failed.');
    }
  }

  async sendMailMass(data: SendMassRequest) {
    try {
      (await this.mailService['SendMass'](data)).message;
      return 
    } catch {
      this.logger.error('Send mail mass failed.');
    }
  }

  async sendPush(data: SendPushRequest) {
    try {
      await this.pushService['SendPush'](data);
    } catch {
      this.logger.error('Send push failed.');
    }
  }
}