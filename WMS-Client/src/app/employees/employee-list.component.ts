import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, switchMap, startWith, of } from 'rxjs';
import { EmployeeService, EmployeeListItem } from '../services/employee.service';
import { AuthService } from '../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule]
})
export class EmployeeListComponent implements OnInit {
  displayedColumns = ['employeeCode', 'fullName', 'email', 'departmentName', 'roleName', 'actions'];
  searchControl = new FormControl('', { nonNullable: true });
  employees$!: Observable<EmployeeListItem[]>;

  constructor(
    private readonly employeeService: EmployeeService,
    public readonly auth: AuthService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.employees$ = this.employeeService.getAll();
  }

  ngOnInit(): void {
    this.employees$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => term ? this.employeeService.search(term) : this.employeeService.getAll())
    );
  }

  openAdd(): void {
    const ref = this.dialog.open(EmployeeDialogComponent, { width: '700px', data: { employee: null } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.employeeService.create(result).subscribe({
        next: () => {
          this.snackBar.open('Employee created', 'Close', { duration: 3000 });
          this.refresh();
        },
        error: (e) => this.snackBar.open(e.error?.message || 'Error creating employee', 'Close', { duration: 5000 })
      });
    });
  }

  openEdit(employee: EmployeeListItem): void {
    this.employeeService.getById(employee.id).subscribe(details => {
      const ref = this.dialog.open(EmployeeDialogComponent, { width: '700px', data: { employee: details } });
      ref.afterClosed().subscribe(result => {
        if (!result) return;
        this.employeeService.update(employee.id, result).subscribe({
          next: () => {
            this.snackBar.open('Employee updated', 'Close', { duration: 3000 });
            this.refresh();
          },
          error: (e) => this.snackBar.open(e.error?.message || 'Error updating employee', 'Close', { duration: 5000 })
        });
      });
    });
  }

  openChangePassword(employee: EmployeeListItem): void {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '450px',
      data: { employeeId: employee.id, employeeName: employee.fullName }
    });
  }

  get canChangePassword(): boolean {
    return this.auth.role === 'Admin' || this.auth.role === 'Manager';
  }

  deleteEmployee(employee: EmployeeListItem): void {
    if (!confirm(`Delete ${employee.fullName}?`)) return;
    this.employeeService.delete(employee.id).subscribe({
      next: () => {
        this.snackBar.open('Employee deleted', 'Close', { duration: 3000 });
        this.refresh();
      },
      error: (e) => this.snackBar.open(e.error?.message || 'Error deleting employee', 'Close', { duration: 5000 })
    });
  }

  refresh(): void {
    this.employees$ = this.employeeService.getAll();
  }

  get canEdit(): boolean {
    return this.auth.role === 'Admin' || this.auth.role === 'Manager';
  }

  get canDelete(): boolean {
    return this.auth.role === 'Admin';
  }
}
