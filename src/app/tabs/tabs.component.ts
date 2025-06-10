import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  standalone: true,
  imports: [RouterModule],
})
export class TabsComponent {
  @Input() selectedTab: string = 'leads';
  @Output() tabSelected = new EventEmitter<string>();

  select(tab: string) {
    this.tabSelected.emit(tab);
  }
}