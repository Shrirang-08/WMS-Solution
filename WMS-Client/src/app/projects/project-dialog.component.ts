import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProjectDto } from '../services/project.service';
import { DepartmentService, DepartmentDto } from '../services/department.service';
import { ClientService, ClientDto } from '../services/client.service';

export interface ProjectDialogData {
  project?: ProjectDto | null;
}

@Component({
  selector: 'app-project-dialog',
  template: `
    <h2 mat-dialog-title>{{data.project ? 'Edit' : 'Add'}} Project</h2>
    <form [formGroup]="form" (ngSubmit)="save()" style="padding:16px;display:flex;flex-direction:column;gap:12px;">
      <mat-form-field appearance="outline">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Client</mat-label>
        <mat-select formControlName="clientId">
          <mat-option *ngFor="let c of clients" [value]="c.id">{{ c.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Department</mat-label>
        <mat-select formControlName="departmentId">
          <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Start Date</mat-label>
        <input matInput type="date" formControlName="startDate" />
      </mat-form-field>

      <mat-form-field appearance="outline">
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
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule]
})
export class ProjectDialogComponent implements OnInit {
  form!: FormGroup;
  departments: DepartmentDto[] = [];
  clients: ClientDto[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProjectDialogData,
    private readonly departmentService: DepartmentService,
    private readonly clientService: ClientService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      clientId: [null, Validators.required],
      departmentId: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['']
    });
  }

  ngOnInit(): void {
    this.departmentService.getAll().subscribe(d => {
      this.departments = d;
      this.cdr.detectChanges();
      if (this.data?.project) {
        this.form.patchValue({ departmentId: this.data.project.departmentId });
      }
    });
    this.clientService.getAll().subscribe(c => {
      this.clients = c;
      this.cdr.detectChanges();
      if (this.data?.project) {
        this.form.patchValue({ clientId: this.data.project.clientId });
      }
    });
    if (this.data?.project) {
      this.form.patchValue({
        name: this.data.project.name,
        description: this.data.project.description,
        startDate: this.data.project.startDate?.slice(0, 10),
        endDate: this.data.project.endDate ? this.data.project.endDate.slice(0, 10) : ''
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
