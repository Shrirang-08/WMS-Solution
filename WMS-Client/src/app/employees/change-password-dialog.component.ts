import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface ChangePasswordData {
  userId?: number;
  employeeId?: number;
  employeeName?: string;
}

@Component({
  selector: 'app-change-password-dialog',
  template: `
    <h2 mat-dialog-title>Change Password</h2>
    <mat-dialog-content>
      <p *ngIf="data.employeeName" style="margin-bottom:16px;color:#64748b;">
        Changing password for <strong>{{ data.employeeName }}</strong>
      </p>
      <form [formGroup]="form">
        <mat-form-field appearance="outline" style="width:100%" *ngIf="!data.userId">
          <mat-label>Current Password</mat-label>
          <input matInput type="password" formControlName="currentPassword" />
        </mat-form-field>
        <mat-form-field appearance="outline" style="width:100%">
          <mat-label>New Password</mat-label>
          <input matInput type="password" formControlName="newPassword" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="save()" [disabled]="form.invalid || loading">{{ loading ? 'Saving...' : 'Save' }}</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatSnackBarModule]
})
export class ChangePasswordDialogComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordData,
    private readonly http: HttpClient,
    private readonly snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      currentPassword: [''],
      newPassword: ['', Validators.required]
    });
    if (!data.userId) {
      this.form.controls['currentPassword'].addValidators(Validators.required);
    }
  }

  save(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const payload: any = { newPassword: this.form.value.newPassword };
    if (this.data.userId) payload.userId = this.data.userId;
    else if (this.data.employeeId) payload.employeeId = this.data.employeeId;
    if (!this.data.userId && !this.data.employeeId) payload.currentPassword = this.form.value.currentPassword;

    this.http.post(`${environment.apiUrl}/auth/change-password`, payload).subscribe({
      next: () => {
        this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (e) => {
        this.snackBar.open(e.error?.message || 'Error changing password', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
