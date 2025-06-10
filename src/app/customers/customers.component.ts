import { Component } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-customers',
  imports: [TabsComponent],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,

})
export class CustomersComponent {} 