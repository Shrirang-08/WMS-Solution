import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DepartmentDto } from '../services/department.service';

export interface DepartmentDialogData {
  department?: DepartmentDto | null;
}

@Component({
  selector: 'app-department-dialog',
  template: `
    <h2 mat-dialog-title>{{data.department ? 'Edit' : 'Add'}} Department</h2>
    <form [formGroup]="form" (ngSubmit)="save()" style="padding:16px;">
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" />
      </mat-form-field>

      <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px;">
        <button mat-button type="button" (click)="cancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Save</button>
      </div>
    </form>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule]
})
export class DepartmentDialogComponent {
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DepartmentDialogData
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    if (data?.department) {
      this.form.patchValue({ name: data.department.name, description: data.department.description });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = { ...(this.data.department ?? {}), ...this.form.value };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
