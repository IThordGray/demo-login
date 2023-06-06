import { Types } from 'mongoose';

export interface IMapper<TEntity = unknown, TModel = unknown> {
  propertyMap: {
    [K in keyof Partial<TModel>]: keyof TEntity;
  };
  toEntity(model: TModel | Partial<TModel>): TEntity | undefined;
  toModel(entity: TEntity): TModel | undefined;
}

export abstract class Mapper<TEntity, TModel> implements IMapper<TEntity, TModel> {
  protected abstract _entityClassExp: new () => TEntity;
  protected abstract _modelClassExp: new () => TModel;
  propertyMap: { [K in keyof Partial<TModel>]: keyof TEntity } = {} as any;

  toEntity(model: Partial<TModel> | TModel | undefined): TEntity | undefined {
    if (!model) return undefined;
    if (model instanceof this._entityClassExp) return model;

    const entity = new this._entityClassExp();
    Object.keys(model).forEach(k => {
      // @ts-ignore
      if (typeof model[k] === 'string' && model[k] === '') model[k] = null;

      // @ts-ignore
      if (this.propertyMap[k]) {
        // @ts-ignore
        entity[this.propertyMap[k] as string] = model[k as string];
      } else {
        // @ts-ignore
        entity[k as string] = model[k as string];
      }
    });

    const [ modelId, entityId ] = Object.entries(this.propertyMap).find(([ modelKey, entityKey ]) => entityKey === '_id') as [ string, string ] ?? [ 'id', '_id' ];
    // @ts-ignore
    if (model[modelId]) {
      // @ts-ignore
      entity[entityId] = new Types.ObjectId(model[modelId]);
      // @ts-ignore
      delete entity[modelId];
    }

    return entity;
  }

  toModel(entity: Partial<TEntity> | TEntity | undefined): TModel | undefined {
    if (!entity) return undefined;
    if (entity instanceof this._modelClassExp) return entity;

    const model = new this._modelClassExp();

    Object.keys(entity).forEach(entityKey => {
      const mappedProperty: [ keyof TModel, keyof TEntity ] | undefined = Object.entries(this.propertyMap).find(([ k, v ]) => v === entityKey) as [ keyof TModel, keyof TEntity ];

      if (mappedProperty) {
        model[mappedProperty[0]] = entity[mappedProperty[1]] as any;
      } else {
        // @ts-ignore
        model[entityKey as string] = entity[entityKey as string];
      }
    });

    const [ modelId, entityId ] = Object.entries(this.propertyMap).find(([ modelKey, entityKey ]) => entityKey === '_id') as [ string, string ] ?? [ 'id', '_id' ];
    // @ts-ignore
    if (entity[entityId]) {
      // @ts-ignore
      model[modelId] = entity[entityId]?.toString();
      // @ts-ignore
      delete model[entityId];
    }

    // @ts-ignore
    delete model['__v'];
    return model;
  }
}
