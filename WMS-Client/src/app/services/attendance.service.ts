import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface AttendanceDto {
  id: number;
  employeeId: number;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private readonly http: HttpClient) {}

  getMonthly(employeeId: number, year: number, month: number): Observable<AttendanceDto[]> {
    return this.http.get<AttendanceDto[]>(`${environment.apiUrl}/attendance/employee/${employeeId}/month/${year}/${month}`);
  }

  checkIn(request: any) {
    return this.http.post(`${environment.apiUrl}/attendance/check-in`, request);
  }

  checkOut(id: number, request: any) {
    return this.http.post(`${environment.apiUrl}/attendance/${id}/check-out`, request);
  }
}
