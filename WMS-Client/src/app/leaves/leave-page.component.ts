import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-leave-page',
  templateUrl: './leave-page.component.html',
  styleUrl: './leave-page.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class LeavePageComponent implements OnInit {
  form!: FormGroup;
  myLeaves: any[] = [];
  teamPending: any[] = [];

  constructor(private readonly fb: FormBuilder, public readonly auth: AuthService, private readonly leaveService: LeaveService, private readonly employeeService: EmployeeService) {
    this.form = this.fb.group({ startDate: ['', Validators.required], endDate: ['', Validators.required], reason: ['', Validators.required] });
  }

  ngOnInit(): void {
    const current = this.auth.currentUserValue;
    const empId = current?.employeeId ?? null;
    if (!empId) return;

    if (this.auth.role === 'Staff') {
      this.leaveService.getByEmployee(empId).subscribe(x => this.myLeaves = x);
    }

    if (this.auth.role === 'Manager' || this.auth.role === 'Admin') {
      // load team members and aggregate pending leaves
      this.employeeService.getById(empId).subscribe(manager => {
        const deptName = manager.departmentName ?? manager.department?.name ?? null;
        this.employeeService.getAll().subscribe(list => {
          const team = deptName ? list.filter(e => e.departmentName === deptName) : list;
          const calls: any[] = [];
          team.forEach(m => calls.push(this.leaveService.getByEmployee(m.id)));
          // simple aggregation (sequential)
          Promise.all(calls.map(c => c.toPromise())).then(results => {
            this.teamPending = results.flat().filter((l: any) => l.status === 'Pending');
          }).catch(() => {});
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
    const payload = { employeeId: empId, startDate: val.startDate, endDate: val.endDate, reason: val.reason };
    this.leaveService.apply(payload).subscribe({ next: (r:any) => { this.leaveService.getByEmployee(empId).subscribe(x => this.myLeaves = x); this.form.reset(); }, error: e => console.error(e) });
  }

  approveReject(id: number, approve: boolean): void {
    this.leaveService.getByEmployee(0); // no-op to keep imports
    const payload = { isApproved: approve };
    // call approve/reject endpoint
    fetch(`${(window as any)['__env']?.apiUrl ?? '/api'}/leaves/${id}/decision`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.auth.token}` }, body: JSON.stringify(payload) }).then(() => {
      this.ngOnInit();
    }).catch(e => console.error(e));
  }
}