import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProjectService, ProjectDto, AllocationDto } from '../services/project.service';
import { EmployeeService } from '../services/employee.service';
import { Observable, of } from 'rxjs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProjectDialogComponent } from './project-dialog.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-project-page',
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, MatDialogModule, ProjectDialogComponent]
})
export class ProjectPageComponent {
  projects$!: Observable<ProjectDto[]>;
  employees$!: Observable<any[]>;
  allocations: Record<number, AllocationDto[]> = {};
  assigning: Record<number, boolean> = {};
  newAssign: Record<number, { employeeId?: number; allocationPercentage: number; startDate?: string; endDate?: string | null }> = {};

  constructor(
    private readonly projectService: ProjectService,
    private readonly employeeService: EmployeeService,
    public readonly auth: AuthService,
    private readonly dialog: MatDialog
  ) {
    this.employees$ = this.employeeService.getAll();
    this.load();
  }

  openAdd(): void {
    const ref = this.dialog.open(ProjectDialogComponent, { data: { project: null } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.projectService.create(result).subscribe({ next: () => this.load(), error: e => console.error(e) });
    });
  }

  openEdit(p: ProjectDto): void {
    const ref = this.dialog.open(ProjectDialogComponent, { data: { project: p } });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.projectService.update(p.id, result).subscribe({ next: () => this.load(), error: e => console.error(e) });
    });
  }

  deleteProject(id: number): void {
    if (!confirm('Delete this project?')) return;
    this.projectService.delete(id).subscribe({ next: () => this.load(), error: e => console.error(e) });
  }

  load(): void {
    this.projects$ = this.projectService.getAll();
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
    this.newAssign[projectId] = { allocationPercentage: 100 };
  }

  cancelAssign(projectId: number): void {
    delete this.assigning[projectId];
    delete this.newAssign[projectId];
  }

  saveAssign(projectId: number): void {
    const payload = this.newAssign[projectId];
    if (!payload || !payload.employeeId) return;
    this.projectService.createAllocation(projectId, {
      employeeId: payload.employeeId!,
      allocationPercentage: payload.allocationPercentage,
      allocationStartDate: payload.startDate ?? new Date().toISOString(),
      allocationEndDate: payload.endDate ?? null
    }).subscribe({ next: () => {
      this.projectService.getAllocations(projectId).subscribe(a => this.allocations[projectId] = a);
      this.cancelAssign(projectId);
    }, error: (e) => console.error(e) });
  }

  removeAllocation(projectId: number, allocationId: number): void {
    if (!confirm('Remove allocation?')) return;
    this.projectService.deleteAllocation(projectId, allocationId).subscribe({ next: () => {
      this.projectService.getAllocations(projectId).subscribe(a => this.allocations[projectId] = a);
    }, error: (e) => console.error(e) });
  }
}