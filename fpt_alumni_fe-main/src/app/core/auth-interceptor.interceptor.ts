import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpClient
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, finalize, switchMap, take, throwError } from 'rxjs';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private http: HttpClient, private authService : AuthServiceService, private router : Router, private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.show();
    console.log("loading show")
   let accessToken = this.authService.getAccessToken();
  //  if(!accessToken){
  //   window.location.href = '/login';
  //  }

    const req = request.clone(
      {
         withCredentials: true,


      // setHeaders: {
      //   Authorization: `Bearer ${accessToken}`,


      // }
    }
    );
    return next.handle(req).pipe(
      finalize(() => {

        this.loadingService.hide();
        console.log("loading hide")}),
      catchError((error: HttpErrorResponse) => {
        console.log(error)
        if (error.status === 401) {
            console.log(error)
            return this.handle401Error(req, next);
        }else if(error.status === 400){
          console.log("error code 401")
        }else if(error.status === 404){
          console.log("error code 404")
        }
        return throwError(error);
      })
    );
  }



  private addToken(request: HttpRequest<any>, token: string | null) {
    if (token) {
      return request.clone({
        withCredentials: true,
        // setHeaders: {
        //   Authorization: `Bearer ${token}`
        // }
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            console.log(token)
            this.isRefreshing = false;
            // Update the access token in AuthService
            //this.authService.refreshToken(token.accessToken);
            // Retry the original request with the new token
            console.log(token.data.accessToken);
            return next.handle(this.addToken(request, token.data.accessToken));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            if (error.status === 404) {//handle when refresh token is expried
              this.router.navigate(['/login']);
            }else{
              console.log("Wrong code error from response")
            }
            return throwError(() => error);
          })
        );
    }
    // If already refreshing, queue the original request until the token is refreshed
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => next.handle(request))
    );
  }
}
