import { DELETED_FLAG } from 'backend/shared';

export function removeDeletedFlag<TModel>(model: TModel): TModel {
  delete (model as any)[DELETED_FLAG];
  return model;
}
