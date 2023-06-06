import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DELETED_FLAG, getErrorMap, removeDeletedFlag } from 'backend/shared';
import { isValidObjectId, Model } from 'mongoose';
import { UserDocument, UserEntity } from './abstractions/user.entity';
import { UserMapper } from './abstractions/user.mapper';
import { User } from './abstractions/user.model';

@Injectable()
export class UsersRepository {
  protected _mapper = new UserMapper();
  protected _errorMap = getErrorMap('User');

  @InjectModel(UserEntity.name) protected _model!: Model<UserDocument>;

  async createAsync(model: Partial<User>): Promise<User> {
    try {
      if (!model.email) throw new Error('Email is required');
      const existing = await this.getByEmailAsync(model.email as string);
      if (existing) throw new ConflictException(this._errorMap.conflictError);

      const entityToCreate = this._mapper.toEntity(model);
      const doc = await new this._model(entityToCreate).save();
      return this._mapper.toModel(doc.toJSON({ virtuals: true }))!;
    } catch (error: any) {
      if (error instanceof ConflictException) throw error;
      if (error.code === 11000) throw new ConflictException(this._errorMap.conflictError);
      throw new BadRequestException(error.message ?? error);
    }
  }

  async getAsync(id: string): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException(this._errorMap.invalidObjectIdError);
    const doc = await this._model.findOne({ _id: id, [DELETED_FLAG]: { $in: [ null, false ] } }).exec();
    if (!doc) throw new NotFoundException(this._errorMap.notFoundError);
    return removeDeletedFlag(this._mapper.toModel(doc.toJSON({ virtuals: true })))!;
  }

  async getByEmailAsync(email: string): Promise<User | undefined> {
    const doc = await this._model.findOne({ email });
    if (!doc) return undefined;
    return this._mapper.toModel(doc.toJSON({ virtuals: true }) as UserEntity);
  }

  async removeSoftAsync(id: string, reason: string): Promise<void> {
    if (!isValidObjectId(id)) throw new BadRequestException(this._errorMap.invalidObjectIdError);
    const doc = await this._model.findOneAndUpdate({ _id: id }, { [DELETED_FLAG]: true, reason }).exec();
    if (!doc) throw new NotFoundException(this._errorMap.notFoundError);
  }

  async updateAsync(id: string, update: Partial<User>): Promise<User> {
    if (!isValidObjectId(id)) throw new BadRequestException(this._errorMap.invalidObjectIdError);
    if ((update as any)[DELETED_FLAG] !== undefined) throw new BadRequestException(this._errorMap.removalNotAllowed);
    const doc = await this._model.findOneAndUpdate({ _id: id }, this._mapper.toEntity(update), { new: true }).exec();
    if (!doc) throw new NotFoundException(this._errorMap.notFoundError);
    return removeDeletedFlag(this._mapper.toModel(doc.toJSON({ virtuals: true })))!;
  }
}
