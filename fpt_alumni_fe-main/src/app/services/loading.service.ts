import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable().pipe(debounceTime(50))
  private activeRequests = 0;

  constructor() { }

  show() {
    this.activeRequests++;
    if (this.activeRequests === 0) {
      this._loading.next(true);
    }
  }

  hide() {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this._loading.next(false);
    }
    console.log("hide, activeRequests:", this.activeRequests);
  }
}
