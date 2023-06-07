import { IErrorMap } from './error.map.interface';

export const ERRORS = {
  unauthorized: 'Unauthorized: You are not authorized to access this resource.',
  tenantTokenMissing: 'Tenant token is missing'
};

export function getErrorMap(entityName: string): IErrorMap {
  return {
    conflictError: `${ entityName } already exists`,
    invalidObjectIdError: `Id [${ entityName }] is not a valid object Id`,
    notFoundError: `${ entityName } not found`,
    removalNotAllowed: 'Not allowed to update the deleted flag'
  };
}
