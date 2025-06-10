import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-customers',
  imports: [AgGridModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,

})
export class CustomersComponent {
  columnDefs: ColDef[] = [
    { headerName: 'Client ID', field: 'id', headerComponentParams: { style: { padding: '10px' } } },
    { headerName: 'Document Type', field: 'documentType', headerComponentParams: { style: { padding: '10px' } } },
    { headerName: 'Document ID', field: 'documentId', headerComponentParams: { style: { padding: '10px' } } },
    { headerName: 'Full Name', field: 'fullName', headerComponentParams: { style: { padding: '10px' } } },
    { headerName: 'Date of Birth', field: 'dateOfBirth', headerComponentParams: { style: { padding: '10px' } } },
    { headerName: 'Gender', field: 'gender', headerComponentParams: { style: { padding: '10px' } } },
    { headerName: 'Address', field: 'address', headerComponentParams: { style: { padding: '10px' } } },
  ];

  rowData = [
    {
      id: 'CLT-456', //make it hyperlink then go to portfolio
      documentType: 'AADHAR',
      documentId: '123456789001',
      fullName: 'John Doe',
      dateOfBirth: '01-01-1990',
      gender: 'Male',
      address: 'Kharadi, Pune, India'
    },
    {
      id: 'CLT-123',
      documentType: 'AADHAR',
      documentId: '123456789001',
      fullName: 'John Doe',
      dateOfBirth: '01-01-1990',
      gender: 'Male',
      address: 'Kharadi, Pune, India'
    }
  ];

  onGridReady(params: any) {
    params.api.sizeColumnsToFit();
    // Or, for best fit per column:
    const allColumnIds: string[] = [];
    params.columnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    params.columnApi.autoSizeColumns(allColumnIds, false);
  }

  defaultColDef = {
    flex: 1,
  };

  statusBar = {
    statusPanels: [
      {
        statusPanel: 'agTotalAndFilteredRowCountComponent',
        align: 'left',
      },
    ],
  };
} 