import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CHANGE_PASSWORD, API_CHANGE_PASSWORD_FORGOT, API_CHECK_FORGOT, API_FORGOT_REQUEST, API_LOGIN, API_LOGIN_PASSWORD, API_LOGOUT, API_REFRESH_TOKEN, Role } from './const/const';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient, private cookieService : CookieService) { }

  hasAnyRole(roles: Role[], role : string): boolean {
    if (!role) {
      return false;
    }
    let userRole : Role;
    switch(role) {
      case 'Alumni':
        userRole = Role.ALUMNI
        break;
      case 'Staff':
        userRole = Role.STAFF
        break;
      case 'Admin':
        userRole = Role.ADMIN
        break;
      default:
        console.error(`Unknown status: ${role}`);
        return false;
        break;// or throw an error, or return a default value
    }
    return roles.includes(userRole);
  }

  login(credential : string): Observable<any>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(API_LOGIN, JSON.stringify(credential), {headers});
  }

  setAccesToken(accessToken : string){
    this.cookieService.delete("ACCESS_TOKEN");
    this.cookieService.set("ACCESS_TOKEN", accessToken);
  }

  setRefreshToken(refreshToken : string){
    this.cookieService.delete("REFRESH_TOKEN");
    this.cookieService.set("REFRESH_TOKEN", refreshToken);
  }

  getAccessToken():string | undefined{
    let token = this.cookieService.get("Access-token");
    if(token){
      return token;
    }
    return undefined;
  }

  getRefreshToken(): string | undefined{
    let refreshToken = this.cookieService.get("Refresh-Token");
    if(refreshToken){
      return refreshToken;
    }
    return undefined;
  }

  refreshToken(){
    return this.http.post(API_REFRESH_TOKEN,{});
  }

  logout() {
    return this.http.post(API_LOGOUT,{});
  }

  loginWithPassword(loginForm: any){
    return this.http.post(API_LOGIN_PASSWORD,loginForm);
  }

  sendResetPasswordEmail(email : string){
    return this.http.post<any>(API_FORGOT_REQUEST, email);
  }

  checkForgotPassword(token : string){
    return this.http.post(API_CHECK_FORGOT + "?token=" + token,{})
  }

  changeForgotPassword(userId: string, token: string, password: string){
    const body = {
      Id: userId,
      Password: password,
      token: token
    };
    return this.http.post(API_CHANGE_PASSWORD_FORGOT, body)
  }

  changePassword(userId: any, currentPassword: any, newPassword : any){
    let body = {
      id: userId,
      currentPassword: currentPassword,
      password: newPassword
    }
    return this.http.post(API_CHANGE_PASSWORD, body);
  }
}
