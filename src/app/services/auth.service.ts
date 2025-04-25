import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import jwt_decode, { jwtDecode } from 'jwt-decode';
import { da, fa, faCountryTranslations } from 'intl-tel-input/i18n';
import { RegisterRequest } from '../interfaces/register-request';

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
        if(response.isemailverified){
          localStorage.setItem(this.tokenkey,response.token)
        }
        return response;
      })
    )
  }

  register(data:RegisterRequest):Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.APIUrl}/register`,data).pipe(
      map((response)=>{
        if(response.isemailverified){
          localStorage.setItem(this.tokenkey,response.token)
        }
        return response;
      })
    )
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
  LoginUser(loginInfo: Array<string>){
    return this.http.post(this.baseServerUrl + "login",{
    email: loginInfo[0],
    password: loginInfo[1]
    },
    {
      responseType:'text'});
  }
  OtpVerfiy(OTP: Array<string>){
    return this.http.post(this.baseServerUrl + "verify-otp",{
    otp: OTP[1],

    },
    {
      responseType:'text'});
  }
}
