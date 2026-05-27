import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { EmployeeListItem } from '../models/employee.models';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<EmployeeListItem[]> {
    return this.http.get<EmployeeListItem[]>(`${environment.apiUrl}/employees`);
  }

  getById(id: number) {
    return this.http.get<any>(`${environment.apiUrl}/employees/${id}`);
  }

  search(term: string): Observable<EmployeeListItem[]> {
    const params = new HttpParams().set('term', term);
    return this.http.get<EmployeeListItem[]>(`${environment.apiUrl}/employees/search`, { params });
  }
}