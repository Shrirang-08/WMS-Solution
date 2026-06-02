import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ShellComponent } from './layout/shell.component';
import { LoginComponent } from './auth/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManagerDashboardComponent } from './dashboard/manager-dashboard.component';
import { StaffDashboardComponent } from './dashboard/staff-dashboard.component';
import { EmployeeListComponent } from './employees/employee-list.component';
import { DepartmentListComponent } from './departments/department-list.component';
import { DepartmentDialogComponent } from './departments/department-dialog.component';
import { AttendancePageComponent } from './attendance/attendance-page.component';
import { LeavePageComponent } from './leaves/leave-page.component';
import { ProjectPageComponent } from './projects/project-page.component';
import { ProjectDialogComponent } from './projects/project-dialog.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ReportsPageComponent } from './reports/reports-page.component';

@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ShellComponent,
    LoginComponent,
    DashboardComponent,
    ManagerDashboardComponent,
    StaffDashboardComponent,
    EmployeeListComponent,
    DepartmentListComponent,
    DepartmentDialogComponent,
    AttendancePageComponent,
    LeavePageComponent,
    ProjectPageComponent,
    ProjectDialogComponent,
    ReportsPageComponent
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
