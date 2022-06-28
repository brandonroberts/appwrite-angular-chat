import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tap } from 'rxjs';

import { ChatService } from './chat.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="chat-container" *ngIf="user$ | async as vm; else loading">
      <div class="chat-header">
        <div class="title">Let's Chat</div>
        <div class="leave" (click)="logout()">Leave Room</div>
      </div>

      <div class="chat-body">
        <div
          id="{{ message.$id }}"
          *ngFor="let message of messages$ | async"
          class="message"
        >
          <span class="name">{{ message.user }}:</span>
          {{ message.messageText }}
        </div>
      </div>

      <div class="chat-message">
        <form [formGroup]="form" (ngSubmit)="sendMessage()">
          <input
            type="text"
            formControlName="message"
            placeholder="Type a message..."
          />
          <button type="submit" class="send-message">
            <svg
              class="arrow"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.0737 3.06325C12.8704 2.65671 12.4549 2.3999 12.0004 2.3999C11.5459 2.3999 11.1304 2.65671 10.9271 3.06325L2.52709 19.8632C2.31427 20.2889 2.37308 20.8001 2.67699 21.1663C2.98091 21.5325 3.4725 21.6845 3.93007 21.5537L9.93006 19.8395C10.4452 19.6923 10.8004 19.2214 10.8004 18.6856V13.1999C10.8004 12.5372 11.3376 11.9999 12.0004 11.9999C12.6631 11.9999 13.2004 12.5372 13.2004 13.1999V18.6856C13.2004 19.2214 13.5556 19.6923 14.0707 19.8394L20.0707 21.5537C20.5283 21.6845 21.0199 21.5325 21.3238 21.1663C21.6277 20.8001 21.6865 20.2889 21.4737 19.8632L13.0737 3.06325Z"
                fill="#373B4D"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>

    <ng-template #loading>Loading...</ng-template>
  `,
  styles: [
    `
      .chat-container {
        width: 100%;
        height: 98vh;
        display: flex;
        flex-direction: column;
        background: #fcfcff;
      }

      .chat-header {
        display: flex;
        flex: none;
        flex-direction: row;
        justify-content: space-between;

        background: #ffffff;
        box-shadow: 0px 4px 40px rgba(55, 59, 77, 0.08);
        width: 100%;
        height: 60px;
      }

      .chat-header .title {
        position: absolute;
        width: 89px;
        height: 27px;
        left: 32px;
        top: 17px;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 150%;
        color: #373b4d;
      }

      .chat-header .leave {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 10px 16px;
        cursor: pointer;

        position: absolute;
        width: 130px;
        height: 41px;
        left: 88%;
        top: 10px;

        background: #fcfcff;

        border: 1px solid #e8e9f0;
        box-sizing: border-box;
        border-radius: 4px;
      }

      .chat-body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 16px;
        overflow: auto;
      }

      span.name {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 150%;
        color: #373b4d;
      }

      .message {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 8px 8px 8px 12px;
        margin: 16px 8px 16px 12px;

        background: #ffffff;
        box-shadow: 0px 1px 4px rgba(55, 59, 77, 0.1),
          0px 1px 4px -1px rgba(55, 59, 77, 0.1);
        border-radius: 0px 8px 8px 8px;
      }

      .incoming {
        background: #e8e9f0;
        align-items: flex-end;
      }

      .chat-message {
        display: flex;
        flex: none;
        flex-direction: row;
        justify-content: space-around;
      }

      .chat-message form {
        display: flex;
        flex-direction: row;
        width: 95%;
      }

      .chat-message input {
        display: flex;
        flex-direction: row;
        width: 100%;
        height: 48px;
        margin-bottom: 4px;

        background: #ffffff;
        border: 1px solid #e8e9f0;
        box-sizing: border-box;
        border-radius: 4px;
      }

      .send-message {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 12px 10px 12px 14px;

        width: 48px;
        height: 48px;

        background: #da1a5b;
        border-radius: 4px;
      }

      .arrow {
        position: static;
        width: 24px;
        height: 24px;
        left: 38px;
        top: 12px;

        transform: rotate(90deg);
      }

      .arrow path {
        fill: #fff;
      }
    `,
  ],
})
export class ChatComponent implements OnInit, OnDestroy {
  messageunSubscribe!: () => void;
  form = new FormGroup({
    message: new FormControl('', { nonNullable: true }),
  });
  user$ = this.authService.user$;
  messages$ = this.chatService.messages$;

  constructor(
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.chatService.loadMessages();
    this.messageunSubscribe = this.chatService.listenToMessages();
  }

  ngOnDestroy() {
    this.messageunSubscribe();
  }

  sendMessage() {
    const message = this.form.controls.message.value;

    this.chatService
      .sendMessage(message)
      .pipe(
        tap(() => {
          this.form.reset();
        })
      )
      .subscribe();
  }

  async logout() {
    await this.authService.logout();
  }
}
