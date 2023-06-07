import { InjectionToken } from '@angular/core';

export const CONFIG = new InjectionToken<Record<string, unknown>>('CONFIG', { factory: () => ({})});
