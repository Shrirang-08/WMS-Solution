import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { LeaveService, LeaveDto } from '../services/leave.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-leave-page',
  templateUrl: './leave-page.component.html',
  styleUrl: './leave-page.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, MatTableModule, MatSnackBarModule]
})
export class LeavePageComponent implements OnInit {
  form!: FormGroup;
  myLeaves: LeaveDto[] = [];
  myPending: LeaveDto[] = [];
  teamPending: LeaveDto[] = [];
  historyColumns = ['from', 'to', 'type', 'reason', 'status'];
  pendingColumns = ['from', 'to', 'type', 'reason', 'actions'];

  constructor(
    private readonly fb: FormBuilder,
    public readonly auth: AuthService,
    private readonly leaveService: LeaveService,
    private readonly employeeService: EmployeeService,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      leaveType: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const current = this.auth.currentUserValue;
    const empId = current?.employeeId ?? null;
    if (!empId) return;

    this.leaveService.getByEmployee(empId).subscribe(x => {
      this.myPending = x.filter(l => l.status === 'Pending');
      this.myLeaves = x.filter(l => l.status !== 'Pending');
    });

    if (this.auth.role === 'Manager' || this.auth.role === 'Admin') {
      this.employeeService.getAll().subscribe(employees => {
        this.leaveService.getPending().subscribe(pending => {
          if (this.auth.role === 'Admin') {
            this.teamPending = pending;
          } else {
            const employeeRoleIds: Record<number, string> = {};
            employees.forEach(e => employeeRoleIds[e.id] = e.roleName);
            this.teamPending = pending.filter(l => employeeRoleIds[l.employeeId] === 'Employee');
          }
        });
      });
    }
  }

  apply(): void {
    if (this.form.invalid) return;
    const current = this.auth.currentUserValue;
    const empId = current?.employeeId ?? null;
    if (!empId) return;
    const val = this.form.value;
    const payload = { employeeId: empId, fromDate: val.fromDate, toDate: val.toDate, leaveType: val.leaveType, reason: val.reason };
    this.leaveService.apply(payload).subscribe({
      next: () => {
        this.snackBar.open('Leave applied successfully', 'Close', { duration: 3000 });
        this.form.reset();
        this.loadData();
      },
      error: (e) => this.snackBar.open(e.error?.message || 'Error applying leave', 'Close', { duration: 5000 })
    });
  }

  approveReject(id: number, approve: boolean): void {
    this.leaveService.approveReject(id, { isApproved: approve, managerComments: approve ? 'Approved' : 'Rejected' }).subscribe({
      next: () => {
        this.snackBar.open(approve ? 'Leave approved' : 'Leave rejected', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (e) => this.snackBar.open('Error processing leave', 'Close', { duration: 3000 })
    });
  }

  cancelLeave(id: number): void {
    if (!confirm('Cancel this leave?')) return;
    this.leaveService.cancel(id).subscribe({
      next: () => {
        this.snackBar.open('Leave cancelled', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Error cancelling leave', 'Close', { duration: 3000 })
    });
  }

  formatDate(d: string): string {
    if (!d) return '';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  get pendingCount(): number {
    return this.myPending.length + this.teamPending.length;
  }
}
