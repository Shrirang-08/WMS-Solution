export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userLoginId: number;
  username: string;
  employeeName: string;
  role: string;
  token: string;
  expiresAtUtc: string;
}

export interface CurrentUser {
  username: string;
  employeeName: string;
  role: string;
  employeeId?: number | null;
  token: string;
}