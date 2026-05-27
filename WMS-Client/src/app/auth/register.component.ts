import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatSelectModule, MatIconModule]
})
export class RegisterComponent {
  form: any;
  isSubmitting = false;
  serverError: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, public router: Router) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      employeeCode: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      dateOfBirth: [null, Validators.required],
      hireDate: [null, Validators.required],
      jobTitle: ['', Validators.required],
      salary: [0],
      departmentId: [2, Validators.required],
      roleId: [3, Validators.required]
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.serverError = null;
    this.isSubmitting = true;
    const value = this.form.value;

    const payload = {
      username: value.username,
      password: value.password,
      employee: {
        employeeCode: value.employeeCode,
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        phoneNumber: value.phoneNumber,
        dateOfBirth: value.dateOfBirth,
        hireDate: value.hireDate,
        jobTitle: value.jobTitle,
        salary: value.salary,
        departmentId: value.departmentId,
        roleId: value.roleId
      }
    };

    this.auth.register(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err: any) => {
        // Try to read error message from API response
        const msg = err?.error?.message ?? err?.message ?? 'Registration failed.';
        console.error(err);
        this.serverError = msg;
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
