import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_USERS, API_ROLES, API_REGISTER, API_GET_USER_BY_ID, API_IMPORT_USER, API_USER_SETTING, API_EXPORT_ERROR_USER, API_GET_ALUMNI_BY_STATUS, API_UPDATE_USER_STATUS, API_GETALL_ALUMNI, API_ADD_WORK_EXPRIENCE, API_ADD_EDUCATION_EXPRIENCE, API_GET_ALL_STAFF } from './const/const';
import { Alumni } from '../model/alumni';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }
  private jsonUrl ='../../assets/json/countries_state.json'


  getProvince(): Observable<any>{
    return this.http.get<any>(this.jsonUrl);
  }

  getAllUser(): Observable<any>{

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.get(API_USERS,{headers});
  }

  getUserById(userId : string){
    if(userId){
      return this.http.get(API_GET_USER_BY_ID+"/"+userId);
    }
    return of()
  }

  getAllRole(): Observable<any>{
    return this.http.get(API_ROLES)
  }

  createNewUser(user :any){
    return this.http.post(API_USERS,user);
  }

  registerUser(userInfo : any){
    return this.http.post(API_REGISTER, {});
  }

  importExcel(file: File){
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
    return this.http.post(API_IMPORT_USER, formData, { headers } )
  }

  getUserSetting(){
    return this.http.get(API_USER_SETTING);
  }

  updateUserSetting(userInfo: any){
    return this.http.put(API_USER_SETTING, userInfo)
  }

  exportErrorUser(invalidKey : string){
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(API_EXPORT_ERROR_USER, JSON.stringify(invalidKey), { headers: headers, responseType: 'blob' });
  }

  getUnauthorizeAlumni(){
    return this.http.get(API_GET_ALUMNI_BY_STATUS+"?status=UNAUTHORIZE")
  }

  changeUserStatusById(userId: string, userStatus : string){
    const body = {
      Id: userId,
      status : userStatus
    };
    return this.http.put(API_UPDATE_USER_STATUS, body)
  }

  getActivatedAlumni(){
    return this.http.get(API_GET_ALUMNI_BY_STATUS+"?status=ACTIVATED")
  }

  getAllAnumni(){
    return this.http.get(API_GETALL_ALUMNI);
  }

  addWorkExperience(work : any){
    return this.http.post(API_ADD_WORK_EXPRIENCE, work);
  }

  addEducationExperience(education : any){
    return this.http.post(API_ADD_EDUCATION_EXPRIENCE, education);
  }

  getAllStaff(){
    return this.http.get(API_GET_ALL_STAFF);
  }
}
