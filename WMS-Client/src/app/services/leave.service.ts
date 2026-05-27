import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface LeaveDto {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  constructor(private readonly http: HttpClient) {}

  getByEmployee(employeeId: number): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${environment.apiUrl}/leaves/employee/${employeeId}`);
  }

  apply(request: any) {
    return this.http.post(`${environment.apiUrl}/leaves/apply`, request);
  }
}
