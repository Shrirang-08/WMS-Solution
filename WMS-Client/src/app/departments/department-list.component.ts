import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DepartmentDialogComponent } from './department-dialog.component';
import { DepartmentService, DepartmentDto } from '../services/department.service';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule, MatSnackBarModule]
})
export class DepartmentListComponent {
  departments$!: Observable<DepartmentDto[]>;
  displayedColumns = ['id', 'name', 'description', 'actions'];

  constructor(
    private readonly deptService: DepartmentService,
    public readonly auth: AuthService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.load();
  }

  openAdd(): void {
    const ref = this.dialog.open(DepartmentDialogComponent, { width: '500px', data: { department: null } });
    ref.afterClosed().subscribe((result: DepartmentDto | null) => {
      if (!result) return;
      this.deptService.create(result).subscribe({
        next: () => { this.snackBar.open('Department created', 'Close', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
      });
    });
  }

  openEdit(dept: DepartmentDto): void {
    const ref = this.dialog.open(DepartmentDialogComponent, { width: '500px', data: { department: dept } });
    ref.afterClosed().subscribe((result: DepartmentDto | null) => {
      if (!result) return;
      this.deptService.update(dept.id, result).subscribe({
        next: () => { this.snackBar.open('Department updated', 'Close', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
      });
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
    this.deptService.delete(id).subscribe({
      next: () => { this.snackBar.open('Department deleted', 'Close', { duration: 3000 }); this.load(); },
      error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
    });
  }
}
