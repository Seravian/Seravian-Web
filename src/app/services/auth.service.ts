import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
// import jwt_decode, { jwtDecode } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { da, fa, faCountryTranslations } from 'intl-tel-input/i18n';
import { RegisterRequest } from '../interfaces/register-request';
import { catchError, tap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { ProfileRequest } from '../interfaces/profile-request';
import { Tokens } from '../interfaces/tokens';
import { Router } from '@angular/router';
import CryptoJS from 'crypto-js';



@Injectable({
  providedIn: 'root'
})

export class AuthService {

  APIUrl:string = environment.APIUrl;
  private tokenkey = 'token'



  constructor(private http: HttpClient) { }

    private router = inject(Router)

  baseServerUrl= "https://seravian.runasp.net/auth/";

  login(data:LoginRequest):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.APIUrl}/login`,data).pipe(
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
    return this.http.post<AuthResponse>(`${this.APIUrl}/register`,data).pipe(
      map((response)=>{
          return response;
      })
    )
  }

  private tempRole: number | null = null;

  setTempRole(role: number) {
    this.tempRole = role;
  }

  getTempRole(): number | null {
    return this.tempRole;
  }

  // getUserDetail = () =>{
  //   const token = this.getToken();
  //   if(!token) return true;
  //   const decodedToken : any = jwtDecode(token);
  //   const userDetail = {
  //     id: decodedToken.nameid,
  //     fullname: decodedToken.name,
  //     email: decodedToken.email,
  //     roles: decodedToken.role || [],
  //   }
  //   return userDetail;
  // }

  isLoggedIn =():boolean =>{
    const token = this.getToken() ;
    if(!token) return false ;
    return !this.isTokenExpired();
  };

  //expiry = 03:00:00 UTC
  //date now = 02:50:00 UTC
  //epiry buffer = 02:59:00 UTC
  //
  //
  //
  //

  private isSignalRTokenValid(): boolean {
    const expiryString = JSON.parse(localStorage.getItem('profileTokens') || '{}').accessTokenExpirationUtc;
    if (!expiryString) return true;
    const expiry = new Date(expiryString).getTime();
    const expiryWithBuffer = expiry - 60_000; // Add 1 min buffer
    return expiryWithBuffer > Date.now();
  }

  private isTokenExpired(): boolean {
    const expiryString = JSON.parse(localStorage.getItem('profileTokens') || '{}').accessTokenExpirationUtc;
    if (!expiryString) return true;

    const expiry = new Date(expiryString).getTime();
    return Date.now() > expiry;
  }

  logout = (): void => {
    const refreshToken = this.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken);

    if (refreshToken) {
      this.http.post(`${this.APIUrl}/logout`, { refreshToken })
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

    return this.http.post<AuthResponse>(`${this.APIUrl}/verify-otp`, { email, otpCode }).pipe(
      map((response) => {
        console.log('OTP verification successful.');
        return response;
      })
    );
  }
  ResendOtpVerfiy(data: [string]): Observable<AuthResponse> {
    const [email] = data;

    return this.http.post<AuthResponse>(`${this.APIUrl}/resend-otp`, { email }).pipe(
      map((response) => {
        return response;
      })
    );
  }

  completeProfile(data: ProfileRequest): Observable<any> {
    return this.http.post(`${this.APIUrl}/complete-profile-setup`, data).pipe(
      tap(() => console.log('Profile info submitted')),
      catchError((error) => {
        console.error('Error submitting profile info:', error);
        return EMPTY;
      })
    );
  }


  refreshTokens(): Observable<Tokens> {
    const refreshToken = this.DecryptToken(JSON.parse(localStorage.getItem('profileTokens') || '{}').refreshToken);

    if (!refreshToken) {
      throw new Error('No refresh token found');
    }

    return this.http.post<Tokens>(`${this.APIUrl}/refresh-token`, {refreshToken: refreshToken})
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

  getTokenForSignalR(): string | null {
    console.log('getTokenForSignalR called');

    if (this.isSignalRTokenValid() === true) {
      const Tokens = JSON.parse(localStorage.getItem('profileTokens') || '{}');
      Tokens.accessToken = this.DecryptToken(Tokens.accessToken);
      console.log('Access token is not expired:', Tokens);
      return Tokens.accessToken ;
    } else {
      let token: string | null = null;
      this.refreshTokens().subscribe({
        next: (tokens) => {
          console.log('Token refreshed successfully:', tokens);
          token = tokens.accessToken || '';
        },
        error: (err) => {
          console.error('error from getTokenForSignalR', err);
        }
      });
      return token;
    }
  }


}
