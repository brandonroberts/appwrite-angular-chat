import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private appwriteService: AuthService) {}

  async ngOnInit() {
    await this.appwriteService.isLoggedIn();
  }
}
