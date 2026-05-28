import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DepartmentService, DepartmentDto } from '../services/department.service';

export interface EmployeeDialogData {
  employee: any | null;
}

@Component({
  selector: 'app-employee-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.employee ? 'Edit Employee' : 'Add Employee' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="dialog-grid">
          <mat-form-field appearance="outline">
            <mat-label>Employee Code</mat-label>
            <input matInput formControlName="employeeCode" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Job Title</mat-label>
            <input matInput formControlName="jobTitle" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Phone</mat-label>
            <input matInput formControlName="phoneNumber" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Date of Birth</mat-label>
            <input matInput [matDatepicker]="dob" formControlName="dateOfBirth" />
            <mat-datepicker-toggle matSuffix [for]="dob"></mat-datepicker-toggle>
            <mat-datepicker #dob></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Hire Date</mat-label>
            <input matInput [matDatepicker]="hire" formControlName="hireDate" />
            <mat-datepicker-toggle matSuffix [for]="hire"></mat-datepicker-toggle>
            <mat-datepicker #hire></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Salary</mat-label>
            <input matInput type="number" formControlName="salary" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Department</mat-label>
            <mat-select formControlName="departmentId">
              <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="roleId">
              <mat-option value="1">Admin</mat-option>
              <mat-option value="2">Manager</mat-option>
              <mat-option value="3">Employee</mat-option>
            </mat-select>
          </mat-form-field>
          <ng-container *ngIf="!data.employee">
            <mat-form-field appearance="outline">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" />
            </mat-form-field>
          </ng-container>
          <mat-checkbox formControlName="isActive" *ngIf="data.employee">Active</mat-checkbox>
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding-top: 8px;
    }
    .full-width { grid-column: 1 / -1; }
    mat-form-field { width: 100%; }
  `],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule]
})
export class EmployeeDialogComponent implements OnInit {
  form!: FormGroup;
  departments: DepartmentDto[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private readonly deptService: DepartmentService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      employeeCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: [null, Validators.required],
      hireDate: [null, Validators.required],
      jobTitle: ['', Validators.required],
      salary: [0],
      departmentId: [null, Validators.required],
      roleId: [null, Validators.required],
      isActive: [true],
      username: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.deptService.getAll().subscribe(d => { this.departments = d; this.cdr.detectChanges(); });
    if (!this.data?.employee) {
      this.form.controls['username'].addValidators(Validators.required);
      this.form.controls['password'].addValidators(Validators.required);
    }
    if (this.data?.employee) {
      const e = this.data.employee;
      this.form.patchValue({
        employeeCode: e.employeeCode,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        phoneNumber: e.phoneNumber || '',
        dateOfBirth: e.dateOfBirth ? new Date(e.dateOfBirth) : null,
        hireDate: e.hireDate ? new Date(e.hireDate) : null,
        jobTitle: e.jobTitle,
        salary: e.salary || 0,
        departmentId: e.departmentId,
        roleId: e.roleId,
        isActive: e.isActive !== false
      });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
