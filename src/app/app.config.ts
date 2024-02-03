import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from "@angular/common/http";
import { withInMemoryScrolling } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })), provideAnimations(), provideHttpClient()]
};
