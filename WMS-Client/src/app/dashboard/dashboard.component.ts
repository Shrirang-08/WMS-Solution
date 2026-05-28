import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { DashboardSummary } from '../models/dashboard.models';
import { AttendanceService, TodayActiveDto } from '../services/attendance.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  summary$: Observable<DashboardSummary>;
  activeEmployees: TodayActiveDto | null = null;

  constructor(
    private readonly dashboardService: DashboardService,
    public readonly auth: AuthService,
    private readonly attendanceService: AttendanceService
  ) {
    this.summary$ = this.dashboardService.getSummary();
  }

  ngOnInit(): void {
    if (this.auth.role === 'Admin' || this.auth.role === 'Manager') {
      this.attendanceService.getTodayActive().subscribe(data => this.activeEmployees = data);
    }
  }

  get quickLinks() {
    const role = this.auth.role;
    if (role === 'Admin') return [
      { label: 'Manage Employees', route: '/employees', icon: 'people', color: '#6366f1' },
      { label: 'Departments', route: '/departments', icon: 'business', color: '#8b5cf6' },
      { label: 'Attendance Reports', route: '/reports', icon: 'assessment', color: '#0ea5e9' },
    ];
    if (role === 'Manager') return [
      { label: 'View Team', route: '/employees', icon: 'people', color: '#6366f1' },
      { label: 'Approve Leaves', route: '/leaves', icon: 'fact_check', color: '#10b981' },
      { label: 'Projects', route: '/projects', icon: 'folder', color: '#f59e0b' },
    ];
    return [
      { label: 'My Attendance', route: '/attendance', icon: 'check_circle', color: '#10b981' },
      { label: 'My Leaves', route: '/leaves', icon: 'event_note', color: '#0ea5e9' },
    ];
  }
}
