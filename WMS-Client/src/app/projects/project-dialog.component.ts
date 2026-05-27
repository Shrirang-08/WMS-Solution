import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProjectDto } from '../services/project.service';

export interface ProjectDialogData {
  project?: ProjectDto | null;
}

@Component({
  selector: 'app-project-dialog',
  template: `
    <h2 mat-dialog-title>{{data.project ? 'Edit' : 'Add'}} Project</h2>
    <form [formGroup]="form" (ngSubmit)="save()" style="padding:16px;">
      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>Start Date</mat-label>
        <input matInput type="date" formControlName="startDate" />
      </mat-form-field>

      <mat-form-field appearance="outline" style="width:100%">
        <mat-label>End Date</mat-label>
        <input matInput type="date" formControlName="endDate" />
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
export class ProjectDialogComponent {
  form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['']
    });

    if (data?.project) {
      this.form.patchValue({ name: data.project.name, description: data.project.description, startDate: data.project.startDate?.slice(0,10), endDate: data.project.endDate ? data.project.endDate.slice(0,10) : '' });
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const payload = { ...(this.data.project ?? {}), ...this.form.value };
    this.dialogRef.close(payload);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
