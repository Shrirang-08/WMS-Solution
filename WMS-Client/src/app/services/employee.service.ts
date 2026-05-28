import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface EmployeeListItem {
  id: number;
  employeeCode: string;
  fullName: string;
  email: string;
  departmentName: string;
  roleName: string;
}

export interface EmployeeDetails {
  id: number;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  hireDate: string;
  jobTitle: string;
  salary: number;
  departmentId: number;
  departmentName: string;
  roleId: number;
  roleName: string;
  isActive: boolean;
  department?: { name: string };
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<EmployeeListItem[]> {
    return this.http.get<EmployeeListItem[]>(`${environment.apiUrl}/employees`);
  }

  getById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/employees/${id}`);
  }

  search(term: string): Observable<EmployeeListItem[]> {
    return this.http.get<EmployeeListItem[]>(`${environment.apiUrl}/employees/search`, { params: new HttpParams().set('term', term) });
  }

  create(data: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/employees`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/employees/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/employees/${id}`);
  }
}
