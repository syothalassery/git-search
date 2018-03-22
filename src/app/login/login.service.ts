import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import 'rxjs/Rx';
import { AuthHttp, tokenNotExpired, JwtHelper } from 'angular2-jwt';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { master } from '../classes/master';
import { MasterService } from '../classes/master-service';

@Injectable()
export class LoginService {
  isLoggedIn: boolean;
  redirectUrl: string;
  jwtHelper: JwtHelper = new JwtHelper();
  requireLoginSubject: Subject<boolean>;
  tokenIsBeingRefreshed: Subject<boolean>;
  lastUrl: string;

  constructor(private http: Http,private authHttp:AuthHttp, private router: Router, private dataService: MasterService) { 
    this.requireLoginSubject = new Subject<boolean>();
    this.tokenIsBeingRefreshed = new Subject<boolean>();
    this.tokenIsBeingRefreshed.next(false);
    this.lastUrl = "/home";
  }
  login(username, password): Observable<any> {
    let authURL = `${master.authURL}`;
    return this.http.post(authURL, {
      "client_id": "2",
      "client_secret": "qazrxGbDwrwbYXwbEbbkUFNO1zGB3eFYQN3AbG3m",
      "username": username,
      "password": password,
      "grant_type": "password"
    })
      .map(response => {
        this.addTokens(response.json().access_token,response.json().refresh_token);
        return "success";
      })
      .catch(error => {
        console.log(error);
        return Observable.throw(error.json());
      });
  }
  checkAuth(): boolean {
    if(this.loggedIn()) {
      this.dataService.setAuthenticate(true);
      this.requireLoginSubject.next(false);
      return true;
    } else {
      this.dataService.setAuthenticate(false);
      return false;
    }
  }

  loggedIn() {
    return tokenNotExpired();
  }
  updateAccess(): Observable<any> {
    let authURL = `${master.authURL}`;
    let r = JSON.parse(localStorage.getItem('refresh_token'));
    return this.http.post(authURL, {
      "client_id": "2",
      "client_secret": "qazrxGbDwrwbYXwbEbbkUFNO1zGB3eFYQN3AbG3m",
      "refresh_token": r,
      "grant_type": "refresh_token"
    }).map(response => {
      return response.json();
    })
      .catch(error => {
        console.log(error);
        return Observable.throw(error.json());
      });
  }
  getRefreshTokenExpirationDate() {
    var token = localStorage.getItem('token');
    if (token) {
      let tokenExpDate = this.jwtHelper.getTokenExpirationDate(token);
      let sessionExpDate = new Date(tokenExpDate.getTime() + 4*60000);
      if (new Date() > sessionExpDate) {
        this.logout();
      }
      return sessionExpDate;
    }

    return null;
  }
  hasRefreshToken() {
    let refToken = localStorage.getItem('refresh_token');

    if (refToken == null) {
      this.logout();
    }

    return refToken != null;
  }
  addTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }
  refreshTokenSuccessHandler(data) {
    if (data.error) {
        console.log("Removing tokens.");
        this.logout();
        this.requireLoginSubject.next(true);
        this.tokenIsBeingRefreshed.next(false);
        this.router.navigateByUrl('/login');
        return false;
    } else {
        this.addTokens(data.access_token, data.refresh_token);
        this.requireLoginSubject.next(false);
        this.tokenIsBeingRefreshed.next(false);
        console.log("Refreshed user token");
    }
  }
  refreshTokenErrorHandler(error) {
    this.requireLoginSubject.next(true);
    this.logout();
    this.tokenIsBeingRefreshed.next(false);
    this.router.navigate(['/login']);
    console.log(error);
  }
  tokenRequiresRefresh(): boolean {
    if (!this.loggedIn()) {
      console.log("Token refresh is required");
    }
    return !this.loggedIn();
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.requireLoginSubject.next(true);
  }

}