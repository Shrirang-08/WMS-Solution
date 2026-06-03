import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AttendanceService, AttendanceDto } from '../services/attendance.service';
import { EmployeeService, EmployeeListItem } from '../services/employee.service';

@Component({
  selector: 'app-attendance-page',
  templateUrl: './attendance-page.component.html',
  styleUrl: './attendance-page.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatSnackBarModule, MatSelectModule, MatFormFieldModule, FormsModule]
})
export class AttendancePageComponent implements OnInit {
  attendance: AttendanceDto[] = [];
  displayedColumns = ['date', 'checkIn', 'checkOut', 'status'];
  loading = false;
  employees: EmployeeListItem[] = [];
  selectedEmployeeId: number | null = null;

  constructor(
    public readonly auth: AuthService,
    private readonly attendanceService: AttendanceService,
    private readonly employeeService: EmployeeService,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.canManageAll) {
      this.employeeService.getAll().subscribe(emps => this.employees = emps);
    }
    this.loadAttendance();
  }

  get canManageAll(): boolean {
    return this.auth.role === 'Admin' || this.auth.role === 'Manager';
  }

  get effectiveEmployeeId(): number {
    return this.selectedEmployeeId ?? this.auth.currentUserValue?.employeeId ?? 0;
  }

  onEmployeeChange(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    const empId = this.effectiveEmployeeId;
    if (!empId) return;
    const now = new Date();
    this.attendanceService.getMonthly(empId, now.getFullYear(), now.getMonth() + 1)
      .subscribe(x => this.attendance = x);
  }

  checkIn(): void {
    const empId = this.effectiveEmployeeId;
    if (!empId) return;
    const now = new Date();
    this.loading = true;
    this.attendanceService.checkIn({
      employeeId: empId,
      attendanceDate: now.toISOString(),
      checkInTime: now.toTimeString().slice(0, 8)
    }).subscribe({
      next: () => {
        this.snackBar.open('Checked in successfully', 'Close', { duration: 3000 });
        this.loadAttendance();
        this.loading = false;
      },
      error: (e) => {
        this.snackBar.open(e.error?.message || 'Error checking in', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  checkOut(id: number): void {
    const now = new Date();
    this.loading = true;
    this.attendanceService.checkOut(id, {
      checkOutTime: now.toTimeString().slice(0, 8)
    }).subscribe({
      next: () => {
        this.snackBar.open('Checked out successfully', 'Close', { duration: 3000 });
        this.loadAttendance();
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Error checking out', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  get todayRecord(): AttendanceDto | undefined {
    const todayStr = this.toLocalDateStr(new Date());
    return this.attendance.find(a => a.attendanceDate && this.toLocalDateStr(new Date(a.attendanceDate)) === todayStr);
  }

  get isCheckedIn(): boolean {
    return !!this.todayRecord?.checkIn && !this.todayRecord?.checkOut;
  }

  get isComplete(): boolean {
    return !!this.todayRecord?.checkIn && !!this.todayRecord?.checkOut;
  }

  formatTime(t: string | null): string {
    if (!t) return '--:--';
    return t.slice(0, 5);
  }

  formatDate(d: string): string {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  private toLocalDateStr(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
