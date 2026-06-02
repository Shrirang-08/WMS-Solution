import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeListComponent } from './employees/employee-list.component';
import { LoginComponent } from './auth/login.component';
import { ShellComponent } from './layout/shell.component';
import { authGuard } from './guards/auth.guard';
import { DepartmentListComponent } from './departments/department-list.component';
import { AttendancePageComponent } from './attendance/attendance-page.component';
import { LeavePageComponent } from './leaves/leave-page.component';
import { ProjectPageComponent } from './projects/project-page.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard.component';
import { StaffDashboardComponent } from './dashboard/staff-dashboard.component';
import { ReportsPageComponent } from './reports/reports-page.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'employees', component: EmployeeListComponent },
      { path: 'departments', component: DepartmentListComponent },
      { path: 'manager', component: ManagerDashboardComponent },
      { path: 'me', component: StaffDashboardComponent },
      { path: 'reports', component: ReportsPageComponent },
      { path: 'attendance', component: AttendancePageComponent },
      { path: 'leaves', component: LeavePageComponent },
      { path: 'projects', component: ProjectPageComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
