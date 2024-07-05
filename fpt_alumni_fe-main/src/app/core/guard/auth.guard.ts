import { LocalStorageService } from './../../services/local-storage.service';
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Role } from 'src/app/services/const/const';

@Injectable({
  providedIn: 'root'
})
 class AuthGuard{
  constructor(private router : Router, private authService: AuthServiceService, private localStorageService : LocalStorageService){}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRoles = next.data['roles'] as Role[];
    if (!this.localStorageService.getItem("Full_Name") || !this.authService.hasAnyRole(requiredRoles, this.localStorageService.getItem("Role"))) {
      return false;
    }
    return true;
  }
}
export const RoleGuard : CanActivateChildFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean =>{
  return inject(AuthGuard).canActivate(next, state);
}
