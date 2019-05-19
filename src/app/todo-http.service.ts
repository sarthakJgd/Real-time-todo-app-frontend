import { Injectable } from '@angular/core';
//Import http
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

//Import Observables
import { Observable } from "rxjs";
import { catchError,tap } from "rxjs/operators";

import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class TodoHttpService {

  public arr = [];
  public allTodos;
  public currentTodo;
  public baseUrl = "http://localhost:3000/api/v1/todos";
  public authToken = "";

  constructor(private _http: HttpClient,
    private cookie: CookieService) {
      this.authToken=this.cookie.get('authtoken');
      
   }

   public getAllTodos(): Observable<any>{
    let myResponse = this._http.get(this.baseUrl+'/all' +'?authToken='+this.authToken);
    console.log(myResponse);
    
    return myResponse;
  }

  public getTodosByCreatedId(): Observable<any>{
    let userId = this.cookie.get('userId');
    let myResponse = this._http.get(this.baseUrl+'/getTodosByCreatedId/'+userId  +'?authToken='+this.authToken);
    console.log(myResponse);
    return myResponse;
  }

  public getFriendsTodos(friendListIds): Observable<any>{
    let friendListIdsArray = friendListIds;
    console.log("friendListIdsArray: "+friendListIdsArray);
    let myResponse = this._http.post(this.baseUrl+'/getFriendsTodos' +'?authToken='+this.authToken,friendListIdsArray);
    console.log(myResponse);
    return myResponse;
  }

  public getSingleTodoInformation(currentTodoId) : any{
  let theResponse = this._http.get(this.baseUrl+'/view'+'/'+currentTodoId +'?authToken='+this.authToken);
  console.log("Single Todo Response:"+ theResponse);
  return theResponse;
  
}
  public createTodo(todoData):any {
  let theResponse = this._http.post(this.baseUrl+'/create' +'?authToken='+this.authToken, todoData);
  console.log("Todo Creation Response:"+ theResponse);
  return theResponse;
}

  public deleteTodo(todoId): any{
  let data = {
    userId: this.cookie.get('userId'),
    userName: this.cookie.get('userName')
  };
  let theResponse = this._http.post(this.baseUrl+'/'+todoId+'/delete'  +'?authToken='+this.authToken,data);
  console.log("Todo Deletion Response:"+ theResponse);
  return theResponse;
}

  public editTodo(todoId, todoData): any{
  let theResponse = this._http.put(this.baseUrl+'/'+todoId+'/edit' +'?authToken='+this.authToken,todoData);
  console.log("Todo Edit Response:"+ theResponse);
  return theResponse;
}

public undoTodoState(todoId): any{
  let userName = this.cookie.get('userName');
  let theResponse = this._http.get(this.baseUrl+'/'+todoId+'/undoTodoState'+'?authToken='+this.authToken+'&userName='+userName);
  console.log("Todo Undo Response:"+ theResponse);
  return theResponse;
}

  private errorHandler(err: HttpErrorResponse){
  console.log("An error occured!");
  console.log(err.message);
  return Observable.throw(err.message);
}
}
