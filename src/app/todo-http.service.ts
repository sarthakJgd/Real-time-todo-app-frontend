import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
//Import http
import {HttpClient, HttpHeaders} from '@angular/common/http';

//Import Observables
import { Observable } from "rxjs";

import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {

  public arr = [];
  public allTodos;
  public currentTodo;
  public baseUrl = `${environment.apiBaseUrl}/api/v1/todos`;
  
  public authToken = "";

  constructor(private _http: HttpClient,
    private cookie: CookieService) {
      this.authToken=this.cookie.get('authtoken');
      
   }

   public getAllTodos(): Observable<any>{
    let myResponse = this._http.get(this.baseUrl+'/all', this.authOptions());
   /*  console.log(myResponse); */
    
    return myResponse;
  }

  public getTodosByCreatedId(): Observable<any>{
    let userId = this.cookie.get('userId');
    let myResponse = this._http.get(this.baseUrl+'/getTodosByCreatedId/'+userId, this.authOptions());
    /* console.log(myResponse); */
    return myResponse;
  }

  public getFriendsTodos(friendListIds): Observable<any>{
    let friendListIdsArray = friendListIds;
   /*  console.log("friendListIdsArray: "+friendListIdsArray); */
    let myResponse = this._http.post(this.baseUrl+'/getFriendsTodos', friendListIdsArray, this.authOptions());
   /*  console.log(myResponse); */
    return myResponse;
  }

  public getSingleTodoInformation(currentTodoId) : any{
  let theResponse = this._http.get(this.baseUrl+'/view'+'/'+currentTodoId, this.authOptions());
  return theResponse;
  
}
  public createTodo(todoData):any {
  let theResponse = this._http.post(this.baseUrl+'/create', todoData, this.authOptions());
  return theResponse;
}

  public deleteTodo(todoId): any{
  let data = {
    userId: this.cookie.get('userId'),
    userName: this.cookie.get('userName')
  };
  let theResponse = this._http.post(this.baseUrl+'/'+todoId+'/delete', data, this.authOptions());
  return theResponse;
}

  public editTodo(todoId, todoData): any{
  let theResponse = this._http.put(this.baseUrl+'/'+todoId+'/edit', todoData, this.authOptions());
  return theResponse;
}

public undoTodoState(todoId): any{
  let userName = this.cookie.get('userName');
  let theResponse = this._http.get(this.baseUrl+'/'+todoId+'/undoTodoState', {
    ...this.authOptions(),
    params: { userName }
  });
  return theResponse;
}

  private authOptions() {
    return { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authToken}`) };
  }
}
