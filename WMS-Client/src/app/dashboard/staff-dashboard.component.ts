import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-staff-dashboard',
  template: `
    <mat-card>
      <h2>My Activity</h2>
      <p>Welcome, {{auth.currentUser$ | async | json}}</p>

      <h3>Recent Leaves</h3>
      <div *ngIf="leaves">
        <div *ngFor="let l of leaves" style="padding:6px 0;border-bottom:1px solid #eee;">
          {{l.startDate}} → {{l.endDate}} — <strong>{{l.status}}</strong>
        </div>
      </div>

      <h3 style="margin-top:12px;">This Month Attendance</h3>
      <div *ngIf="attendance">
        <div *ngFor="let a of attendance" style="padding:6px 0;border-bottom:1px solid #eee;">
          {{a.attendanceDate}} — In: {{a.checkIn || '—'}} Out: {{a.checkOut || '—'}}
        </div>
      </div>
    </mat-card>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule]
})
export class StaffDashboardComponent implements OnInit {
  leaves: any[] = [];
  attendance: any[] = [];

  constructor(public readonly auth: AuthService, private readonly leaveService: LeaveService, private readonly attendanceService: AttendanceService) {}

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    const employeeId = user?.employeeId ?? null;
    if (employeeId) {
      this.leaveService.getByEmployee(employeeId).subscribe(x => this.leaves = x);
      const now = new Date();
      this.attendanceService.getMonthly(employeeId, now.getFullYear(), now.getMonth() + 1).subscribe(x => this.attendance = x);
    }
  }
}
