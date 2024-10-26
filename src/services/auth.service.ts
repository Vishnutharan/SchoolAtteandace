import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginRequest, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8082/api/auth';
  private readonly TOKEN_KEY = 'token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Only check auth on the browser platform
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticatedSubject.next(this.checkInitialAuth());
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem(this.TOKEN_KEY, response.token);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => new Error('Authentication failed'));
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
    this.isAuthenticatedSubject.next(false);
  }

  private checkInitialAuth(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }
}
