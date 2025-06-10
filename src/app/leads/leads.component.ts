import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { N8nService } from '../services/n8n/n8n.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Lead {
  lead_first_name: string;
  lead_last_name: string;
  lead_company_name: string;
  lead_official_title: string;
  lead_type: string;
  lead_generation_source: string;
  lead_status: string;
  lead_contact_number: string;
  selected?: boolean;
}

@Component({
  selector: 'app-leads',
  imports: [TabsComponent, CommonModule, FormsModule, AgGridModule],
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss'],
  standalone: true,
})

export class LeadsComponent {

  constructor(private router: Router, private n8nService: N8nService) { }

  @Output() tabChanged = new EventEmitter<{ tab: string; clientId: string | null }>();

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
  isChatOpen: boolean = false;
  selectedLeads: Lead[] = [];

  // AG Grid properties
  columnDefs: ColDef[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 60,
      minWidth: 60,
      maxWidth: 60,
      pinned: 'left',
      resizable: false,
      sortable: false,
      filter: false,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '8px'
      }
    },
    {
      headerName: 'First Name',
      field: 'lead_first_name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
    },
    {
      headerName: 'Last Name',
      field: 'lead_last_name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { display: 'flex', alignItems: 'center', fontWeight: '500' }
    },
    {
      headerName: 'Company',
      field: 'lead_company_name',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
      cellStyle: { display: 'flex', alignItems: 'center', color: '#008080', fontWeight: '500' }
    },
    {
      headerName: 'Title',
      field: 'lead_official_title',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 160,
      cellStyle: { display: 'flex', alignItems: 'center', fontStyle: 'italic', color: '#555' }
    },
    {
      headerName: 'Type',
      field: 'lead_type',
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: (params: any) => {
        const type = params.value;
        const colors: any = {
          'prospect': '#17a2b8',
          'qualified': '#28a745',
          'hot': '#dc3545'
        };
        return `<span style="
          background: ${colors[type] || '#6c757d'};
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        ">${type}</span>`;
      },
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      headerName: 'Source',
      field: 'lead_generation_source',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { display: 'flex', alignItems: 'center', color: '#6c757d' }
    },
    {
      headerName: 'Status',
      field: 'lead_status',
      sortable: true,
      filter: true,
      width: 130,
      cellRenderer: (params: any) => {
        const status = params.value;
        const colors: any = {
          'new': '#007bff',
          'contacted': '#ffc107',
          'meeting_scheduled': '#28a745',
          'closed': '#6c757d'
        };
        return `<span style="
          background: ${colors[status] || '#6c757d'};
          color: white;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        ">${status.replace('_', ' ')}</span>`;
      },
      cellStyle: { display: 'flex', alignItems: 'center' }
    },
    {
      headerName: 'Contact',
      field: 'lead_contact_number',
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 120,
      cellStyle: { display: 'flex', alignItems: 'center', fontFamily: 'monospace', color: '#008080' }
    }
  ];

  // Sample data with more leads for testing
  rowData: Lead[] = [
    {
      lead_first_name: "John",
      lead_last_name: "Doe",
      lead_company_name: "ACME Corp",
      lead_official_title: "Software Engineer",
      lead_type: "prospect",
      lead_generation_source: "website",
      lead_status: "new",
      lead_contact_number: "48736473",
      selected: false
    },
    {
      lead_first_name: "Jane",
      lead_last_name: "Smith",
      lead_company_name: "Tech Solutions",
      lead_official_title: "Product Manager",
      lead_type: "qualified",
      lead_generation_source: "referral",
      lead_status: "contacted",
      lead_contact_number: "12345678",
      selected: false
    },
    {
      lead_first_name: "Bob",
      lead_last_name: "Johnson",
      lead_company_name: "Startup Inc",
      lead_official_title: "CTO",
      lead_type: "hot",
      lead_generation_source: "social_media",
      lead_status: "meeting_scheduled",
      lead_contact_number: "87654321",
      selected: false
    },
    {
      lead_first_name: "Alice",
      lead_last_name: "Williams",
      lead_company_name: "Digital Agency",
      lead_official_title: "Marketing Director",
      lead_type: "prospect",
      lead_generation_source: "linkedin",
      lead_status: "new",
      lead_contact_number: "55512345",
      selected: false
    },
    {
      lead_first_name: "Charlie",
      lead_last_name: "Brown",
      lead_company_name: "Finance Corp",
      lead_official_title: "Financial Analyst",
      lead_type: "qualified",
      lead_generation_source: "event",
      lead_status: "contacted",
      lead_contact_number: "99887766",
      selected: false
    }
  ];

  // Default column definitions
  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    minWidth: 100,
  };

  // AG Grid ready handler
  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
  }

  // AG Grid selection change handler
  onSelectionChanged(event: any): void {
    this.selectedLeads = event.api.getSelectedRows();
    console.log('Selected leads:', this.selectedLeads);
  }

  // Trigger KYC function
  triggerKYC(): void {
    if (this.selectedLeads.length > 0) {
      const selectedNames = this.selectedLeads.map(lead => 
        `${lead.lead_first_name} ${lead.lead_last_name}`
      ).join(', ');
      
      alert(`Triggering KYC for: ${selectedNames}`);
      
      // Add KYC logic here
      console.log('Triggering KYC for selected leads:', this.selectedLeads);
      
      // Add a chat message about the KYC trigger
      this.messages.push({
        text: `KYC process initiated for ${this.selectedLeads.length} lead(s): ${selectedNames}`,
        isUser: false,
        timestamp: new Date(),
      });
      this.shouldScrollToBottom = true;
    }
  }

  // Check if any leads are selected
  get hasSelectedLeads(): boolean {
    return this.selectedLeads.length > 0;
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

  // Toggle chat visibility
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