import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { AttendanceService } from '../services/attendance.service';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrl: './attendance-page.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class AttendancePageComponent implements OnInit {
  attendance: any[] = [];

  constructor(public readonly auth: AuthService, private readonly attendanceService: AttendanceService) {}

  ngOnInit(): void {
    const user = this.auth.currentUserValue;
    const empId = user?.employeeId ?? null;
    if (!empId) return;
    const now = new Date();
    this.attendanceService.getMonthly(empId, now.getFullYear(), now.getMonth() + 1).subscribe(x => this.attendance = x);
  }

  checkIn(): void {
    const user = this.auth.currentUserValue;
    const empId = user?.employeeId ?? null;
    if (!empId) return;
    this.attendanceService.checkIn({ employeeId: empId, attendanceDate: new Date().toISOString() }).subscribe(() => this.ngOnInit());
  }

  checkOut(id: number): void {
    this.attendanceService.checkOut(id, {}).subscribe(() => this.ngOnInit());
  }
}