import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { N8nService } from '../services/n8n/n8n.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-performance',
  imports: [TabsComponent, CommonModule, FormsModule, AgGridModule],
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  standalone: true,

})

export class PerformanceComponent {

  @Output() tabChanged = new EventEmitter<{ tab: string; clientId: string | null }>();

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  constructor(private n8nService: N8nService) {}

  clientId: string = '';

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

      this.n8nService.getN8nData(message).subscribe({
        next: (response: any) => {
          console.log('Response from n8n:', response);
          this.messages.push({
            text: response || 'I am not sure how to respond to that.',
            isUser: false,
            timestamp: new Date(),
          });
        },
        error: (error) => {
          console.error('Error fetching data from n8n:', error);
          this.messages.push({
            text: 'Sorry, I encountered an error while processing your request.',
            isUser: false,
            timestamp: new Date(),
          });
          this.shouldScrollToBottom = true;
        },
      });

      // Simulate bot response
      // setTimeout(() => {
      //   this.messages.push({
      //     text: `Thanks for your message: "${message}". How else can I assist you?`,
      //     isUser: false,
      //     timestamp: new Date(),
      //   });
      //   this.shouldScrollToBottom = true;
      // }, 1000);
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