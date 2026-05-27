import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-reports-page',
  template: `
    <mat-card>
      <h2>Admin Reports</h2>
      <p>Export simple CSV reports.</p>
      <div style="display:flex;gap:8px;margin-top:12px;">
        <button mat-raised-button color="primary" (click)="exportEmployees()">Export Employees (CSV)</button>
      </div>
    </mat-card>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class ReportsPageComponent {
  constructor(private readonly employeeService: EmployeeService) {}

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

  private toCsv(items: any[]): string {
    if (!items || items.length === 0) return '';
    const keys = Object.keys(items[0]);
    const header = keys.join(',');
    const rows = items.map(i => keys.map(k => `"${(i[k] ?? '').toString().replace(/"/g,'""')}"`).join(','));
    return [header, ...rows].join('\n');
  }
}
