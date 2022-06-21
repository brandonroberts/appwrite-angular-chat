import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';

import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      RouterModule.forRoot([
        {
          path: 'chat',
          loadComponent: () =>
            import('./app/chat.component').then((m) => m.ChatComponent),
        },
        {
          path: '',
          loadComponent: () =>
            import('./app/login.component').then((m) => m.LoginComponent),
        },
      ])
    ),
  ],
});
