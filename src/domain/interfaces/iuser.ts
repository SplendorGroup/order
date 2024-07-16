import { UserMethodsName } from '@/infraestructure/clients/user';

export interface IUserProvider {
  proxyUser(method: UserMethodsName, data: any): Promise<any>;
}
