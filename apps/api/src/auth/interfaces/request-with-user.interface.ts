import { Request } from 'express';

export interface UserFromJwt {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface RequestWithUser extends Request {
  user: UserFromJwt;
}
