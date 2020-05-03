import { Injectable } from '@angular/core';
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

  private url =  //"http://RealTimeTodoApp-env.qqmk7cimzg.us-east-2.elasticbeanstalk.com";
  "http://localhost:3000";
  
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

    const params = new HttpParams()
      .set('authToken', this.cookie.get('authtoken'))

    return this.http.post(`${this.url}/api/v1/users/logout`, params);

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
    this.authToken = this.cookie.get('authtoken');
    let myResponse = this.http.get(this.url + '/api/v1/users/view/all' + '?authToken=' + this.authToken);
   /*  console.log(myResponse); */
    return myResponse;
  }

  public sendFriendRequest(data): Observable<any> {
    const params = new HttpParams()
      .set('requestorId', data.requestorId)
      .set('requestorName', data.requestorName)
      .set('requestedId', data.requestedId)
      .set('requestedName', data.requestedName)


    this.authToken = this.cookie.get('authtoken');

    let myResponse = this.http.put(this.url + '/api/v1/users/sendFriendRequest' + '?authToken=' + this.authToken, params);
   /*  console.log(myResponse); */
    return myResponse;
  }

  public getSingleUserInformation(userId): Observable<any> {
    this.authToken = this.cookie.get('authtoken');
    let theResponse = this.http.get(this.url + '/api/v1/users/' + userId + '/details?authToken=' + this.authToken);
   /*  console.log("Single Todo Response:" + theResponse); */
    return theResponse;
  }

  public acceptFriendRequest(data): Observable<any> {
    const params = new HttpParams()
      .set('requestorId', data.requestorId)
      .set('requestorName', data.requestorName)
      .set('requestedId', data.requestedId)
      .set('requestedName', data.requestedName)


    this.authToken = this.cookie.get('authtoken');

    let myResponse = this.http.put(this.url + '/api/v1/users/acceptFriendRequest' + '?authToken=' + this.authToken, params);
    /* console.log(myResponse); */
    return myResponse;
  }

  public rejectFriendRequest(data): Observable<any> {
    const params = new HttpParams()
      .set('requestorId', data.requestorId)
      .set('requestorName', data.requestorName)
      .set('requestedId', data.requestedId)
      .set('requestedName', data.requestedName)


    this.authToken = this.cookie.get('authtoken');

    let myResponse = this.http.put(this.url + '/api/v1/users/rejectFriendRequest' + '?authToken=' + this.authToken, params);
   /*  console.log(myResponse); */
    return myResponse;
  }
}