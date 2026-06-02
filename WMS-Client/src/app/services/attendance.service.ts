import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface AttendanceDto {
  id: number;
  employeeId: number;
  employeeName?: string;
  attendanceDate: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  remarks?: string | null;
}

export interface TodayActiveEmployeeDto {
  attendanceId: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  checkInTime: string;
}

export interface TodayActiveDto {
  totalActive: number;
  employees: TodayActiveEmployeeDto[];
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private readonly http: HttpClient) {}

  getMonthly(employeeId: number, year: number, month: number): Observable<AttendanceDto[]> {
    return this.http.get<AttendanceDto[]>(`${environment.apiUrl}/attendance/employee/${employeeId}/month/${year}/${month}`);
  }

  checkIn(request: { employeeId: number; attendanceDate?: string; checkInTime?: string }) {
    return this.http.post(`${environment.apiUrl}/attendance/check-in`, request);
  }

  checkOut(id: number, request: { checkOutTime?: string; remarks?: string }) {
    return this.http.post(`${environment.apiUrl}/attendance/${id}/check-out`, request);
  }

  getAll(): Observable<AttendanceDto[]> {
    return this.http.get<AttendanceDto[]>(`${environment.apiUrl}/attendance/all`);
  }

  getTodayActive(): Observable<TodayActiveDto> {
    return this.http.get<TodayActiveDto>(`${environment.apiUrl}/attendance/today-active`);
  }
}
