import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ProjectDto {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string | null;
  projectCode?: string | null;
  clientId: number;
  departmentId: number;
}

export interface AllocationDto {
  id: number;
  employeeId: number;
  employeeName: string;
  allocationPercentage: number;
  allocationStartDate: string;
  allocationEndDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ProjectDto[]> {
    return this.http.get<ProjectDto[]>(`${environment.apiUrl}/projects`);
  }

  getAllocations(projectId: number): Observable<AllocationDto[]> {
    return this.http.get<AllocationDto[]>(`${environment.apiUrl}/projects/${projectId}/allocations`);
  }

  createAllocation(projectId: number, payload: { employeeId: number; allocationPercentage: number; allocationStartDate: string; allocationEndDate?: string | null; }) {
    return this.http.post(`${environment.apiUrl}/projects/${projectId}/allocations`, payload);
  }

  deleteAllocation(projectId: number, allocationId: number) {
    return this.http.delete(`${environment.apiUrl}/projects/${projectId}/allocations/${allocationId}`);
  }

  create(request: { name: string; description?: string; startDate: string; endDate?: string | null; }) {
    return this.http.post(`${environment.apiUrl}/projects`, request);
  }

  update(id: number, request: { name: string; description?: string; startDate: string; endDate?: string | null; }) {
    return this.http.put(`${environment.apiUrl}/projects/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/projects/${id}`);
  }
}
