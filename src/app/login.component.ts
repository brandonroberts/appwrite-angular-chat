import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="app-container">
      <div class="content">
        <span class="appwrite-chat">Angular Chat</span>

        <div class="login-container">
          <form [formGroup]="form" class="login-form" (ngSubmit)="login()">
            <p class="login-name">
              <label for="name">Name</label>

              <input
                type="text"
                id="name"
                formControlName="name"
                placeholder="Enter Name"
              />
            </p>

            <button type="submit">Start Chatting</button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        width: 442px;
        height: 200px;
        padding: 24px;
        display: flex;
        flex-direction: column;

        background: #ffffff;
        border: 1px solid rgba(232, 233, 240, 0.5);
        box-sizing: border-box;
        box-shadow: 0px 20px 24px -5px rgba(55, 59, 77, 0.1),
          0px 8px 24px -6px rgba(55, 59, 77, 0.1);
        border-radius: 16px;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        padding: 0;
        margin: 0;
      }

      .login-name,
      .login-room {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding-right: 4px;
        padding-bottom: 4px;
        width: 100%;
        margin: 8px 0 8px 0;
      }

      .login-name input,
      .login-room input {
        background: #ffffff;
        border: 1px solid #e8e9f0;
        box-sizing: border-box;
        border-radius: 4px;
        height: 3rem;
      }

      ::placeholder {
        position: static;
        height: 24px;
        left: 16px;
        top: 12px;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 150%;
        color: #616b7c;
      }

      span.join-room {
        padding-bottom: 8px;

        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-size: 20px;
        line-height: 150%;

        color: #616b7c;
      }

      .login-container button {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 12px 20px;
        color: #fcfcff;
        width: 100%;

        background: #da1a5b;
        border: 1px solid #c00d53;
        box-sizing: border-box;
        border-radius: 4px;
      }
    `,
  ],
})
export class LoginComponent {
  form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
  });

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    const name = this.form.controls.name.value;

    this.authService
      .login(name)
      .pipe(
        tap(() => {
          this.router.navigate(['/chat']);
        })
      )
      .subscribe();
  }
}
