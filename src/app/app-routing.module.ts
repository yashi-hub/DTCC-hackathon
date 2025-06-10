import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeadsComponent } from './leads/leads.component';
import { CustomersComponent } from './customers/customers.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PerformanceComponent } from './performance/performance.component';
import { TabsComponent } from './tabs/tabs.component';

const routes: Routes = [
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'leads', component: LeadsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'performance', component: PerformanceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }