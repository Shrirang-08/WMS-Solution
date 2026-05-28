import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface LeaveDto {
  id: number;
  employeeId: number;
  employeeName?: string;
  fromDate: string;
  toDate: string;
  leaveType: string;
  reason: string;
  status: string;
  managerComments?: string;
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  constructor(private readonly http: HttpClient) {}

  getByEmployee(employeeId: number): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${environment.apiUrl}/leaves/employee/${employeeId}`);
  }

  getPending(): Observable<LeaveDto[]> {
    return this.http.get<LeaveDto[]>(`${environment.apiUrl}/leaves/pending`);
  }

  apply(request: { employeeId: number; fromDate: string; toDate: string; leaveType: string; reason: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/leaves/apply`, request);
  }

  cancel(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/leaves/${id}/cancel`, {});
  }

  approveReject(id: number, request: { isApproved: boolean; managerComments?: string }): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/leaves/${id}/decision`, request);
  }
}
