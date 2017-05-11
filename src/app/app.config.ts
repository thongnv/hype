import { InjectionToken } from '@angular/core';

export interface AppConfig {
    apiEndpoint: string;
    title: string;
}

export const _CONFIG: AppConfig = {
    apiEndpoint: 'hylo.dev',
    title: 'Dependency Injection'
};

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');
