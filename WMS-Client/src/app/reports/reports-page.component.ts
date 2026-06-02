import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { EmployeeService } from '../services/employee.service';
import { AttendanceService, AttendanceDto } from '../services/attendance.service';

@Component({
  selector: 'app-reports-page',
  templateUrl: './reports-page.component.html',
  styleUrls: ['./reports-page.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule]
})
export class ReportsPageComponent implements OnInit {
  attendanceRecords: AttendanceDto[] = [];
  displayedColumns = ['employeeId', 'date', 'checkIn', 'checkOut', 'status'];

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly attendanceService: AttendanceService
  ) {}

  ngOnInit(): void {
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.attendanceService.getAll().subscribe(x => this.attendanceRecords = x);
  }

  exportEmployees(): void {
    this.employeeService.getAll().subscribe(list => {
      const csv = this.toCsv(list);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  exportAttendance(): void {
    const rows = this.attendanceRecords.map(a => ({
      EmployeeCode: '',
      EmployeeName: '',
      Date: a.attendanceDate ? new Date(a.attendanceDate).toLocaleDateString() : '',
      CheckIn: a.checkIn || '',
      CheckOut: a.checkOut || '',
      Status: a.status
    }));
    const csv = this.toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  formatTime(t: string | null): string {
    if (!t) return '--:--';
    return t.slice(0, 5);
  }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  private toCsv(items: any[]): string {
    if (!items || items.length === 0) return '';
    const keys = Object.keys(items[0]);
    const header = keys.join(',');
    const rows = items.map(i => keys.map(k => `"${(i[k] ?? '').toString().replace(/"/g,'""')}"`).join(','));
    return [header, ...rows].join('\n');
  }
}
