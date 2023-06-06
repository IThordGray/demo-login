import { Mapper } from 'backend/shared';
import { UserEntity } from './user.entity';
import { User } from './user.model';

export class UserMapper extends Mapper<UserEntity, User> {
  private static _mapper: UserMapper;

  protected _entityClassExp = UserEntity;
  protected _modelClassExp = User;

  static get(): UserMapper {
    if (!this._mapper) this._mapper = new UserMapper();
    return this._mapper;
  }
}
