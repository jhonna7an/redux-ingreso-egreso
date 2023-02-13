import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboard.routes';

const rutasHijas: Routes = [
  {
    path: '',
    component: DashboardComponent,
    // canActivate: [AuthGuard],
    children: dashboardRoutes
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutasHijas)
  ]
})
export class DashboardRoutesModule { }
