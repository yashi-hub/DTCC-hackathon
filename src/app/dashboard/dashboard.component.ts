import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false,
})
export class DashboardComponent implements AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  messages: ChatMessage[] = [
    {
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ];

  currentMessage: string = '';
  private shouldScrollToBottom = false;

  // New property to control chat visibility
  isChatOpen: boolean = false;

  sendMessage(): void {
    const message = this.currentMessage.trim();

    if (message) {
      // Add user message
      this.messages.push({
        text: message,
        isUser: true,
        timestamp: new Date(),
      });

      // Clear input
      this.currentMessage = '';
      this.shouldScrollToBottom = true;

      // Simulate bot response
      setTimeout(() => {
        this.messages.push({
          text: `Thanks for your message: "${message}". How else can I assist you?`,
          isUser: false,
          timestamp: new Date(),
        });
        this.shouldScrollToBottom = true;
      }, 1000);
    }
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  // New method to toggle chat visibility
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      // Scroll to bottom when chat opens
      setTimeout(() => {
        this.shouldScrollToBottom = true;
      }, 100);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop =
          this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
