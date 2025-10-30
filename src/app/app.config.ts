import { ApplicationConfig, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { createApollo } from './graphql.config';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    {
      provide: APOLLO_OPTIONS,
      useFactory: () => {
        const httpLink = inject(HttpLink);
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://carpoolbff-c576f25b03e8.herokuapp.com/graphql'
          })
        };
      }
    }
  ]
};

