export interface AuthUser {
  id: string;
  name: string;
  email: string;
  email_verify: boolean;
  roles: string[];
  permissions: string[];
}

export interface Entity {
  id: string;
  name: string;
  email: string;
  email_verify: boolean;
  created_at: string;
  updated_at: string;
}

export interface FindAllDTO {
  id?: string;
  name?: string;
  email?: string;
  page?: string;
  start_date?: string;
  end_date?: string;
}

export interface FindAllRequest {
  query?: FindAllDTO;
  user?: AuthUser;
}

export interface FindAllResponse {
  total: number;
  page: number;
  pages: number;
  per_page: number;
  in_page: number;
  data: Entity[];
}

export interface FindOneDTO {
  id: string;
}

export interface FindOneRequest {
  params: FindOneDTO;
  user?: AuthUser;
}

export interface FindOneResponse {
  id: string;
  name: string;
  email: string;
  email_verify: boolean;
  created_at: string;
  updated_at: string;
  roles: string[];
  permissions: string[];
}

export interface CreateDTO {
  name: string;
  email: string;
  email_verify: boolean;
  active: boolean;
}

export interface CreateRequest {
  body: CreateDTO;
  user?: AuthUser;
}

export interface UpdateDTO {
  name: string;
  email: string;
  email_verify: boolean;
  active: boolean;
}

export interface UpdateParamDTO {
  id: string;
}

export interface UpdateRequest {
  params: UpdateParamDTO;
  body: UpdateDTO;
  user?: AuthUser;
}

export interface DeleteDTO {
  id: string;
}

export interface DeleteRequest {
  params: DeleteDTO;
  user?: AuthUser;
}

export interface DeleteResponse {}

export interface SyncRoleWithUserDTO {
  user_id: string;
  role_id: string;
}

export interface SyncRoleWithUserRequest {
  body: SyncRoleWithUserDTO;
  user?: AuthUser;
}

export interface SyncRoleWithUserResponse {}
