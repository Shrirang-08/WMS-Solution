import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CurrentUser, LoginRequest, LoginResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'wms_user';
  private readonly currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.readUserFromStorage());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => this.setUser(response)),
      map(response => response)
    );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUserSubject.next(null);
  }

  get token(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value?.token;
  }

  get role(): string | null {
    return this.currentUserSubject.value?.role ?? null;
  }

  private setUser(response: LoginResponse): void {
    const token = response.token;
    let employeeId: number | null = null;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        employeeId = payload['employeeId'] ? Number(payload['employeeId']) : null;
      }
    } catch {
      employeeId = null;
    }

    const user: CurrentUser = {
      username: response.username,
      employeeName: response.employeeName,
      role: response.role,
      employeeId,
      token: response.token
    };

    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private readUserFromStorage(): CurrentUser | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) as CurrentUser : null;
  }
}