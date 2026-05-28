import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ProjectService, ProjectDto, AllocationDto } from '../services/project.service';
import { EmployeeService } from '../services/employee.service';
import { ProjectDialogComponent } from './project-dialog.component';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, MatSnackBarModule, MatDialogModule, MatSelectModule]
})
export class ProjectPageComponent {
  projects$!: Observable<ProjectDto[]>;
  employees$!: Observable<any[]>;
  allocations: Record<number, AllocationDto[]> = {};
  assigning: Record<number, boolean> = {};
  newAssign: Record<number, { employeeId: number | null; allocationPercentage: number }> = {};
  displayedColumns = ['name', 'description', 'actions'];

  constructor(
    private readonly projectService: ProjectService,
    private readonly employeeService: EmployeeService,
    public readonly auth: AuthService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {
    this.load();
  }

  load(): void {
    this.projects$ = this.projectService.getAll().pipe(shareReplay(1));
    this.employees$ = this.employeeService.getAll().pipe(shareReplay(1));
  }

  openAdd(): void {
    const ref = this.dialog.open(ProjectDialogComponent, { width: '600px', data: { project: null } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.projectService.create(result).subscribe({
        next: () => { this.snackBar.open('Project created', 'Close', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
      });
    });
  }

  openEdit(p: ProjectDto): void {
    const ref = this.dialog.open(ProjectDialogComponent, { width: '600px', data: { project: p } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.projectService.update(p.id, result).subscribe({
        next: () => { this.snackBar.open('Project updated', 'Close', { duration: 3000 }); this.load(); },
        error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
      });
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Delete this project?')) return;
    this.projectService.delete(id).subscribe({
      next: () => { this.snackBar.open('Project deleted', 'Close', { duration: 3000 }); this.load(); },
      error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
    });
  }

  toggleAllocations(projectId: number): void {
    if (this.allocations[projectId]) {
      delete this.allocations[projectId];
      return;
    }
    this.projectService.getAllocations(projectId).subscribe(a => this.allocations[projectId] = a);
  }

  canAssign(): boolean {
    return this.auth.role === 'Admin' || this.auth.role === 'Manager';
  }

  startAssign(projectId: number): void {
    this.assigning[projectId] = true;
    this.newAssign[projectId] = { employeeId: null, allocationPercentage: 100 };
  }

  cancelAssign(projectId: number): void {
    delete this.assigning[projectId];
    delete this.newAssign[projectId];
  }

  saveAssign(projectId: number): void {
    const payload = this.newAssign[projectId];
    if (!payload || !payload.employeeId) return;
    this.projectService.createAllocation(projectId, {
      employeeId: payload.employeeId,
      allocationPercentage: payload.allocationPercentage,
      allocationStartDate: new Date().toISOString(),
      allocationEndDate: null
    }).subscribe({
      next: () => {
        this.snackBar.open('Employee assigned', 'Close', { duration: 3000 });
        this.projectService.getAllocations(projectId).subscribe(a => this.allocations[projectId] = a);
        this.cancelAssign(projectId);
      },
      error: (e) => this.snackBar.open(e.error?.message || 'Error', 'Close', { duration: 3000 })
    });
  }

  removeAllocation(projectId: number, allocationId: number): void {
    if (!confirm('Remove allocation?')) return;
    this.projectService.deleteAllocation(projectId, allocationId).subscribe({
      next: () => {
        this.projectService.getAllocations(projectId).subscribe(a => this.allocations[projectId] = a);
      },
      error: (e) => this.snackBar.open('Error removing allocation', 'Close', { duration: 3000 })
    });
  }
}
