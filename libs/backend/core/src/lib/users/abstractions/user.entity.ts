import { DELETED_FLAG, ISoftDelete } from 'backend/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export interface BasicUserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

export type UserDocument = HydratedDocument<UserEntity>;

@Schema({ collection: 'users' })
export class UserEntity implements ISoftDelete, BasicUserInfo {
  @Prop()
  firstName!: string;

  @Prop()
  lastName!: string;

  @Prop()
  email!: string;

  @Prop()
  password!: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  resetCodeSegment?: string;

  @Prop()
  [DELETED_FLAG]?: boolean;

  @Prop()
  reason?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);
