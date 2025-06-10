import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { RegisterRequest } from '../interfaces/register-request';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { ProfileRequest } from '../interfaces/profile-request';
import { Tokens } from '../interfaces/tokens';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';
import { DoctorVerificationRequestResponseDto } from '../interfaces/doctor-verification-request-response-dto';



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  AuthUrl:string = environment.apiUrl + 'auth';
  DocAuthUrl:string = environment.apiUrl + 'doctor';

  constructor(private http: HttpClient) { }

    private router = inject(Router)

  // *************************************************
  // ************General Auth Endpoints***************
  // *************************************************

  login(data:LoginRequest):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AuthUrl}/login`,data).pipe(
      map((response)=>{

        if(response.isEmailVerified){
          console.log('email verified login is working');
          return response;

        }else{
          console.log('email not verified');
          return response;
        }
      })
    )
  }

  register(data:RegisterRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.AuthUrl}/register`,data).pipe(
      map((response)=>{
          return response;
      })
    )
  }

  completeProfile(data: ProfileRequest): Observable<any> {
    return this.http.post(`${this.AuthUrl}/complete-profile-setup`, data).pipe(
      tap(() => console.log('Profile info submitted')),
      catchError((error) => {
        console.error('Error submitting profile info:', error);
        return EMPTY;
      })
    );
  }

// *************************************************
// ************Doctor Auth Endpoints****************
// *************************************************

  getDoctorVerificationRequests(): Observable<DoctorVerificationRequestResponseDto[]> {
    return this.http.get<DoctorVerificationRequestResponseDto[]>(`${this.DocAuthUrl}/get-doctor-verification-requests`).pipe(
      map((response) => response)
    );
  }

// ***************************************************************
  private tempRole: number | null = null;

  setTempRole(role: number) {
    this.tempRole = role;
  }

  getTempRole(): number | null {
    return this.tempRole;
  }
// **********************************************************
  private email: string | null = null;

  setTempEmail(email: string | null) {
    this.email = email;
  }

  getTempEmail(): string | null {
    return this.email;
  }
// ***********************************************************

  private pass: string | null = null;

  setTempPass(pass: string | null) {
    this.pass = pass;
  }

  getTempPass(): string | null {
    return this.pass;
  }
// ************************************************************



  isLoggedIn =():boolean =>{
    const token = this.getToken() ;
    if(!token) return false ;
    return !this.isTokenExpired();
  };

  private isTokenExpired(): boolean {
    const expiryString = JSON.parse(localStorage.getItem('profileTokens') || '{}').accessTokenExpirationUtc;
    if (!expiryString) return true;

    const expiry = new Date(expiryString).getTime();
    return Date.now() > expiry;
  }

  logout = (): void => {
    const refreshToken = this.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken);

    if (refreshToken) {
      this.http.post(`${this.AuthUrl}/logout`, { refreshToken })
        .subscribe({
          next: () => {
            console.log('Logout request sent successfully.');
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error('Error during logout request:', err);
          },
          complete: () => {
            this.clearLocalStorage();
          }
        });
    } else {
      console.log('No refresh token found.');
    }
  };

  private clearLocalStorage(): void {
    localStorage.removeItem('profile');
    localStorage.removeItem('profileTokens');
  }

  private getToken = ():string | null => JSON.parse(localStorage.getItem('profileTokens') || '{}').accessToken;



  OtpVerfiy(data: [string, string]): Observable<AuthResponse> {
    const [email, otpCode] = data;

    return this.http.post<AuthResponse>(`${this.AuthUrl}/verify-otp`, { email, otpCode }).pipe(
      map((response) => {
        console.log('OTP verification successful.');
        return response;
      })
    );
  }
  ResendOtpVerfiy(data: [string]): Observable<AuthResponse> {
    const [email] = data;

    return this.http.post<AuthResponse>(`${this.AuthUrl}/resend-otp`, { email }).pipe(
      map((response) => {
        return response;
      })
    );
  }




  refreshTokens(): Observable<Tokens> {
    const refreshToken = this.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken);

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    return this.http.post<Tokens>(`${this.AuthUrl}/refresh-token`, {refreshToken: refreshToken})
    .pipe(
      map((response) => {
        // Save new tokens
        const encryptedAccessToken = this.EncryptToken(response.accessToken!);
        const encryptedRefreshToken = this.EncryptToken(response.refreshToken!);
        const profileTokens = {
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          accessTokenExpirationUtc: response.accessTokenExpirationUtc,
        };
        localStorage.setItem('profileTokens', JSON.stringify(profileTokens));
        return response;
      })
    );
  }


  EncryptToken(token: string): string | null {
    if (!token){ console.log('no token was passed to encryption'); return null;}
    const encrypted = CryptoJS.AES.encrypt(token, JSON.parse(localStorage.getItem('profile') || '{}').id).toString();
    return encrypted;
  }

  DecryptToken(encrypted : string): string | null {
    if (!encrypted) { console.log('no token was passed to decryption'); return null;}
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, JSON.parse(localStorage.getItem('profile') || '{}').id);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt token', error);
      return null;
    }
  }

  async getTokenForSignalR(): Promise<string> {
    console.log('getTokenForSignalR called');

    try {
      const tokens = await firstValueFrom(this.refreshTokens()); // Convert Observable to Promise
      console.log('Token refreshed successfully:', tokens);
      return tokens.accessToken || '';
    } catch (error) {
      console.error('Error from getTokenForSignalR', error);
      return '';
    }
  }



}

