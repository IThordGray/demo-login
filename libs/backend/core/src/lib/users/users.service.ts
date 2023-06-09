import { Inject } from '@nestjs/common';
import { User } from './abstractions/user.model';
import { hashPasswordAsync } from './password.helper';
import { UsersRepository } from './users.repository';

export class UsersService {
  @Inject(UsersRepository) protected readonly _repo!: UsersRepository;

  async createAsync(model: User): Promise<User> {
    if (model.password) model.password = await hashPasswordAsync(model.password!);
    return await this._repo.createAsync(model);
  }

  async getAsync(id: string): Promise<User> {
    return this._repo.getAsync(id);
  }

  async getByEmailAsync(email: string): Promise<User | undefined> {
    return this._repo.getByEmailAsync(email);
  }

  async removeSoftAsync(id: string, reason: string): Promise<void> {
    const user = await this._repo.getAsync(id);
    await this._repo.removeSoftAsync(id, reason);
  }

  async setRefreshTokenAsync(id: string, refreshToken: string | null): Promise<User> {
    const hashedRefreshToken = refreshToken
      ? await hashPasswordAsync(refreshToken)
      : null;
    return this._repo.updateAsync(id, { refreshToken: hashedRefreshToken });
  }

  async updateAsync(id: string, update: Partial<User>): Promise<User> {
    return await this._repo.updateAsync(id, update);
  }
}
