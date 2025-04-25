import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { da, fa, faCountryTranslations } from 'intl-tel-input/i18n';
import { RegisterRequest } from '../interfaces/register-request';
import { catchError, tap } from 'rxjs/operators';
import { of, EMPTY } from 'rxjs';
import { ProfileRequest } from '../interfaces/profile-request';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  APIUrl:string = environment.APIUrl;
  private tokenkey = 'token'
  constructor(private http: HttpClient) { }
  baseServerUrl= "https://seravian.runasp.net/auth/";
  login(data:LoginRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.APIUrl}/login`,data).pipe(
      map((response)=>{
        // if(!response.isProfileSetupComplete){
        //   // localStorage.setItem(this.tokenkey,response.token.accessToken)
        //   // sessionStorage.setItem('email', data.email);
        //   console.log("hi")
        // }
        return response;
      })
    )
  }

  register(data:RegisterRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.APIUrl}/register`,data).pipe(
      map((response)=>{
        if(response.isEmailVerified){
          localStorage.setItem(this.tokenkey,response.token.accessToken)
        }
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
  getUserDetail = () =>{
    const token = this.getToken();
    if(!token) return true;
    const decodedToken : any = jwtDecode(token);
    const userDetail = {
      id: decodedToken.nameid,
      fullname: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.role || [],
    }
    return userDetail;
  }

  isLoggedIn =():boolean =>{
    const token = this.getToken();
    if(!token) return false ;
    return !this.isTokenExpired();
  };
  private isTokenExpired(){
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired= Date.now() > decoded['exp']! *1000;
    if(isTokenExpired) this,this.logout();
    return isTokenExpired;
  }

  logout=():void => {
    localStorage.removeItem(this.tokenkey)
  }

  private getToken = ():string | null => localStorage.getItem(this.tokenkey) || '';
  SignUpUser(user: Array<string>){
    return this.http.post(this.baseServerUrl + "register",{
    email: user[0],
    password: user[1]
    },
    {
      responseType:'text'});
  }

  Otpverify(otp: Array<string>){
    return this.http.post(this.baseServerUrl + "verify-otp",{
    email: otp[0],
    otpCode: otp[1]
    },
    {
      responseType:'text'});
  }
  OtpVerfiy(data: [string, string]): Observable<AuthResponse> {
    const [email, otpCode] = data;

    return this.http.post<AuthResponse>(`${this.APIUrl}/verify-otp`, { email, otpCode }).pipe(
      map((response) => {
        console.log('OTP verification successful.');
        return response;
      }),
      catchError((error) => {
        if (error.error?.errors) {
          const errors = error.error.errors;
          const allMessages = Object.values(errors).flat();
          console.error('OTP verification error:', allMessages[0]); // Log the first error message
        } else {
          console.error('Unexpected error verifying OTP:', error);
        }
        return EMPTY;
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
}