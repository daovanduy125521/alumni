import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast } from '../model/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastServiceService{


  constructor() {}
  private toastSubject = new Subject<Toast>();
  toastState = this.toastSubject.asObservable();

  showToast(toast: Toast) {

    this.toastSubject.next(toast);
    console.log(this.toastSubject)
  }

}
