import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { catchError, tap, } from 'rxjs/operators';
//import 'rxjs/add/operator/toPromise';
//import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/do';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = environment.apiBaseUrl;
  
  private authToken: any;
  constructor(public http: HttpClient, public cookie: CookieService, ) {
  }

  public getUserInfoFromLocalStorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public signUpFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('email', data.email)
      .set('countryCode', data.countryCode)
      .set('mobileNumber', data.mobileNumber)
      .set('password', data.password)
    //.set('apiKey', data.apiKey);

    return this.http.post(this.url + '/api/v1/users/signup', params);
  }

  public signInFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password);

    return this.http.post(this.url + '/api/v1/users/login', params);
  }

  public logout(): Observable<any> {
    return this.http.post(`${this.url}/api/v1/users/logout`, {}, this.authOptions());

  } // end logout function

  public forgotPasswordSendMail(email): Observable<any> {
    const param = new HttpParams().set("email", email);
    return this.http.post(`${this.url}/api/v1/users/resetPassword`, param);
  }

  public resetPasswords(data): Observable<any> {
    let params = new HttpParams()
      .set("userId", data.userId)
      .set("authToken", data.authToken)
      .set("userPassword", data.userPassword);
    return this.http.post(`${this.url}/api/v1/users/resetNewPassword`, params);
  }

  public getAllUsers(): Observable<any> {
    let myResponse = this.http.get(this.url + '/api/v1/users/view/all', this.authOptions());
   /*  console.log(myResponse); */
    return myResponse;
  }

  public sendFriendRequest(data): Observable<any> {
    const params = new HttpParams()
      .set('requestorId', data.requestorId)
      .set('requestorName', data.requestorName)
      .set('requestedId', data.requestedId)
      .set('requestedName', data.requestedName)


    let myResponse = this.http.put(this.url + '/api/v1/users/sendFriendRequest', params, this.authOptions());
   /*  console.log(myResponse); */
    return myResponse;
  }

  public getSingleUserInformation(userId): Observable<any> {
    let theResponse = this.http.get(this.url + '/api/v1/users/' + userId + '/details', this.authOptions());
    return theResponse;
  }

  public acceptFriendRequest(data): Observable<any> {
    const params = new HttpParams()
      .set('requestorId', data.requestorId)
      .set('requestorName', data.requestorName)
      .set('requestedId', data.requestedId)
      .set('requestedName', data.requestedName)


    let myResponse = this.http.put(this.url + '/api/v1/users/acceptFriendRequest', params, this.authOptions());
    /* console.log(myResponse); */
    return myResponse;
  }

  public rejectFriendRequest(data): Observable<any> {
    const params = new HttpParams()
      .set('requestorId', data.requestorId)
      .set('requestorName', data.requestorName)
      .set('requestedId', data.requestedId)
      .set('requestedName', data.requestedName)


    let myResponse = this.http.put(this.url + '/api/v1/users/rejectFriendRequest', params, this.authOptions());
   /*  console.log(myResponse); */
    return myResponse;
  }

  private authOptions() {
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${this.cookie.get('authtoken')}`) };
  }
}
