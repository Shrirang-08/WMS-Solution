import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EmployeeService } from '../services/employee.service';
import { DepartmentService } from '../services/department.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <mat-card>
      <h2>Manager Dashboard</h2>
      <p>View your team's employees (read-only).</p>

      <mat-form-field appearance="outline">
        <mat-label>Filter by department</mat-label>
        <mat-select [(value)]="selectedDeptName" (selectionChange)="filterByDept()">
          <mat-option [value]="null">All</mat-option>
          <mat-option *ngFor="let d of departments" [value]="d.name">{{d.name}}</mat-option>
        </mat-select>
      </mat-form-field>

      <div *ngIf="employees">
        <div *ngFor="let e of employees" style="padding:8px 0;border-bottom:1px solid #eee;">
          <strong>{{e.fullName}}</strong> — {{e.jobTitle}} — {{e.departmentName}}
        </div>
      </div>
    </mat-card>
  `,
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatSelectModule]
})
export class ManagerDashboardComponent implements OnInit {
  employees: any[] = [];
  departments: any[] = [];
  selectedDeptName: string | null = null;

  constructor(private readonly employeeService: EmployeeService, private readonly departmentService: DepartmentService, private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(d => this.departments = d);

    const current = this.auth.currentUserValue;
    const empId = current?.employeeId ?? null;
    if (empId) {
      this.employeeService.getById(empId).subscribe(manager => {
        const deptName = manager.departmentName ?? manager.department?.name ?? null;
        this.employeeService.getAll().subscribe(list => {
          this.employees = deptName ? list.filter(e => e.departmentName === deptName) : list;
        });
      }, () => {
        // fallback to full list if unable to load manager details
        this.employeeService.getAll().subscribe(list => this.employees = list);
      });
    } else {
      this.employeeService.getAll().subscribe(list => this.employees = list);
    }
  }

  load(): void {
    this.employeeService.getAll().subscribe(x => this.employees = x);
  }

  filterByDept(): void {
    if (!this.selectedDeptName) {
      this.load();
      return;
    }
    this.employees = this.employees.filter(e => e.departmentName === this.selectedDeptName);
  }
}
