import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_GET_ALL_FIELDS } from './const/const';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(private http: HttpClient) { }

  getAllFields(){
    return this.http.get(API_GET_ALL_FIELDS);
  }


}
