import { Component, inject } from '@angular/core';
import { MessageComponent } from './components/message.component';
import { WebsocketService } from '../webosocket.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  template: `
    <div class="h-screen flex flex-col overflow-hidden">
      <header class="bg-gray-200 p-4 flex items-center justify-end">
        <button
          class="bg-black rounded-md text-white px-4 py-2"
          (click)="logOut()"
        >
          Logout
        </button>
      </header>

      <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        <!-- <app-message />
        <app-message [myMessage]="true" /> -->

        @for(message of messages(); track message) {
        <app-message
          [message]="message"
          [myMessage]="username() === message.user"
        />
        }
      </div>

      <div class="flex gap-x-4 mt-4 p-4">
        <input
          type="text"
          class="w-full rounded-md border outline-none border-gray-200 p-2"
          [formControl]="messageControl"
        />
        <button
          class="cursor-pointer bg-black px-4 py-2 rounded-md text-white"
          (click)="sendMessage()"
        >
          Enviar
        </button>
      </div>
    </div>
  `,
  imports: [MessageComponent, ReactiveFormsModule],
})
export default class ChatComponent {
  private websocketService = inject(WebsocketService);

  messages = this.websocketService.messages;

  messageControl = new FormControl('');

  username = this.websocketService.username;

  sendMessage() {
    const value = this.messageControl.value;

    if (!value) return;

    this.websocketService.sendChatMessage(value);
    this.messageControl.setValue('');
  }

  logOut() {
    this.websocketService.logOut();
  }
}
