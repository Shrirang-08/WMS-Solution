import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DepartmentDto {
  id: number;
  name: string;
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<DepartmentDto[]> {
    return this.http.get<DepartmentDto[]>(`${environment.apiUrl}/departments`);
  }

  create(request: { name: string; description?: string }) {
    return this.http.post(`${environment.apiUrl}/departments`, request);
  }

  update(id: number, request: { name: string; description?: string }) {
    return this.http.put(`${environment.apiUrl}/departments/${id}`, request);
  }

  delete(id: number) {
    return this.http.delete(`${environment.apiUrl}/departments/${id}`);
  }
}
