import { Prop } from '@nestjs/mongoose';

export const DELETED_FLAG = '_deleted';

export interface IReason {
  reason?: string;
}

export interface ISoftDelete extends IReason {
  [DELETED_FLAG]?: boolean;
}

export class SoftDelete implements ISoftDelete {
  @Prop()
  [DELETED_FLAG]?: boolean;

  @Prop()
  reason?: string;
}


export const SoftDeleteSchema = {
  [DELETED_FLAG]: Boolean,
  reason: String
}

export function withSoftDelete<T extends new (...args: any[]) => object>(Base: T) {
  return class extends Base implements ISoftDelete {
    [DELETED_FLAG]?: boolean;
    reason?: string;
  };
}
