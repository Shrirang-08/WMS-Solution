import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentDialogComponent } from './department-dialog.component';
import { DepartmentService, DepartmentDto } from '../services/department.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, DepartmentDialogComponent]
})
export class DepartmentListComponent {
  departments$!: Observable<DepartmentDto[]>;
  displayedColumns = ['id', 'name', 'description', 'actions'];

  constructor(private readonly deptService: DepartmentService, public readonly auth: AuthService, private readonly dialog: MatDialog) {
    this.load();
  }

  openAdd(): void {
    const ref = this.dialog.open(DepartmentDialogComponent, { data: { department: null } });
    ref.afterClosed().subscribe((result: DepartmentDto | null) => {
      if (!result) return;
      this.deptService.create(result).subscribe({ next: () => this.load(), error: e => console.error(e) });
    });
  }

  openEdit(dept: DepartmentDto): void {
    const ref = this.dialog.open(DepartmentDialogComponent, { data: { department: dept } });
    ref.afterClosed().subscribe((result: DepartmentDto | null) => {
      if (!result) return;
      this.deptService.update(dept.id, result).subscribe({ next: () => this.load(), error: e => console.error(e) });
    });
  }

  load(): void {
    this.departments$ = this.deptService.getAll();
  }

  canEdit(): boolean {
    return this.auth.role === 'Admin';
  }

  delete(id: number): void {
    if (!confirm('Delete this department?')) return;
    this.deptService.delete(id).subscribe({ next: () => this.load(), error: (e) => console.error(e) });
  }
}