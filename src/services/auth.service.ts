import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8082/api/auth';
  private readonly TOKEN_KEY = 'token';
  isAuthenticated = false;
  private http: HttpClient; // Dependency injection fix
  private platformId = inject(PLATFORM_ID);

  constructor(http: HttpClient) { // Inject HttpClient
    this.http = http;
    this.initializeAuthStatus();
  }

  private initializeAuthStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = this.checkInitialAuth();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => this.handleLoginResponse(response)),
        catchError((error) => this.handleLoginError(error))
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.isAuthenticated = false;
  }

  private checkInitialAuth(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.TOKEN_KEY)
      : null;
  }

  private handleLoginResponse(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      this.isAuthenticated = true;
    }
  }

  private handleLoginError(error: any): Observable<never> {
    console.error('Login error:', error);
    return throwError(() => new Error('Authentication failed'));
  }
}
