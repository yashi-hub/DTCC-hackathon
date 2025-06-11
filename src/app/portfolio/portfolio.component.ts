import { ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Component, ElementRef, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { N8nService } from '../services/n8n/n8n.service';
import { ChatComponent } from '../chat/chat.component';
import { CurrentPortfolioService, CurrentPositionsResponseContent } from '../services/current-portfolio/current-portfolio.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface PositionTableData {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  average_price: number;
  close_price: number;
  last_price: number;
  pnl: number;
  buy_quantity: number;
  buy_price: number;
}

@Component({
  selector: 'app-portfolio',
  imports: [TabsComponent, CommonModule, FormsModule,NgChartsModule,ChatComponent],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  standalone: true,
})

export class PortfolioComponent implements OnInit {
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = ['Large Cap', 'Mid Cap', 'Small Cap'];
  public pieChartDatasets = [ { data: [70, 20, 10] } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  @Output() tabChanged = new EventEmitter<{ tab: string; clientId: string | null }>();

  constructor(
    private n8nService: N8nService,
    private currentPortfolioService: CurrentPortfolioService
  ) {}

  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

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

  // Properties for positions table
  positionsData: PositionTableData[] = [];
  isLoadingPositions: boolean = false;
  positionsError: string | null = null;

  ngOnInit(): void {
    this.loadCurrentPositions();
  }

  loadCurrentPositions(): void {
    this.isLoadingPositions = true;
    this.positionsError = null;

    this.currentPortfolioService.getCurrentPositions().subscribe({
      next: (response) => {
        try {
          // Parse the output string to extract JSON
          const outputString = response.output;
          const jsonString = outputString.replace(/^json\n/, '');
          const parsedData: CurrentPositionsResponseContent = JSON.parse(jsonString);
          
          // Map the net positions to table data format
          this.positionsData = parsedData.net.map(position => ({
            tradingsymbol: position.tradingsymbol,
            exchange: position.exchange,
            quantity: position.quantity,
            average_price: position.average_price,
            close_price: position.close_price,
            last_price: position.last_price,
            pnl: position.pnl,
            buy_quantity: position.buy_quantity,
            buy_price: position.buy_price
          }));
          
          this.isLoadingPositions = false;
        } catch (error) {
          console.error('Error parsing positions data:', error);
          this.positionsError = 'Failed to parse positions data';
          this.isLoadingPositions = false;
        }
      },
      error: (error) => {
        console.error('Error fetching positions:', error);
        this.positionsError = 'Failed to load positions data';
        this.isLoadingPositions = false;
      }
    });
  }

  refreshPositions(): void {
    this.loadCurrentPositions();
  }

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