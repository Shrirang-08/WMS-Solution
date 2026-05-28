import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ClientDto {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ClientDto[]> {
    return this.http.get<ClientDto[]>(`${environment.apiUrl}/clients`);
  }
}
