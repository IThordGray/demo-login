import { Request } from 'express';
import { User } from '../../users/abstractions/user.model';

export type RequestWithUser = Request & { user: User };
