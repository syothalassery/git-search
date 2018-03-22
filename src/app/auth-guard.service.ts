import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  Route
}                           from '@angular/router';
import { LoginService } from './login/login.service';
import { MasterService } from './classes/master-service';
@Injectable()
export class AuthGuard implements CanActivate{

  constructor( private authService : LoginService, private router : Router ) {
  }

  canActivate( route : ActivatedRouteSnapshot, state : RouterStateSnapshot ) {
    let url: string = state.url;
    return this.checkLogin(url);
    // else navigate to login
  }
  checkLogin(url: string): boolean {
    if (this.authService.checkAuth()) { return true; }
 
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
 
    // Navigate to the login page
    this.router.navigate(['/login']);
    return false;
  }
}