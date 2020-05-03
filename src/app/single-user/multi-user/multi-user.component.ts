import { Component, OnInit, Input } from '@angular/core';
import { TodoService } from 'src/app/todo.service';
import { NgForm } from '@angular/forms';
import { empty } from 'rxjs';
import { TodoHttpService } from 'src/app/todo-http.service';
import { DatePipe } from '@angular/common';
import { HeaderComponent } from './../header/header.component';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { ErrorComponent } from '../error/error.component';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-multi-user',
  templateUrl: './multi-user.component.html',
  styleUrls: ['./multi-user.component.css']
})
export class MultiUserComponent implements OnInit {

  public title: String;
  public todoList: any;
  public completedTodoList: any;
  public showCompletedTodoList: any = false;
  public createdBy: any;
  private jwt: any;
  step: number;
  userId: string;
  friendList: any;
  friendListIds: any;
  friendsListLength: any;
  todoListLength: any;
  editedBy: any;
  durationInSeconds: number = 2;
  totalTodoList: any;
  completedTodoListLength: any;
  color:any="primary";
  mode:any="indeterminate";
  value:any;
  showSpinner:boolean = false;

  constructor(private todoService: TodoService,
    private todoHttpService: TodoHttpService,
    private appService: AppService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private cookie: CookieService,
    private router: Router,
    private socketService: SocketService,
    private snackBar: MatSnackBar) {

  }


  ngOnInit() {
    this.checkStatus();
    this.jwt = this.cookie.get('authtoken');
    this.getSingleUserInformation();
    //this.getFriendsTodos();
  }

  public checkStatus: any = () => {

    if (this.cookie.get('authtoken') === undefined || this.cookie.get('authtoken') === '' || this.cookie.get('authtoken') === null) {

      this.router.navigateByUrl('/');

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public getSingleUserInformation() {
    this.showSpinner = true;
    this.userId = this.cookie.get('userId');
    this.appService.getSingleUserInformation(this.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.friendList = apiResponse.data.friendsList;
        if (this.friendList.length != 0) {
          this.friendListIds = this.friendList.map((friend) => friend.friendId);
        }
        
        this.friendsListLength = this.friendList.length;
        this.showSpinner = false;
        this.todoListLength = 0
        if(this.friendsListLength !=0){
          this.getFriendsTodos();
        }
      } else {
        this.showSpinner = false;
        this.toastr.error("Error while fetching single user info")
      }
    })
  }

  public getFriendsTodos() {
    this.showSpinner = true;
    if (this.friendListIds) {
      if (this.friendListIds.length !== 0) {
        
        this.todoHttpService.getFriendsTodos(this.friendListIds).subscribe(
          data => {
            
            this.todoList=[];
            this.completedTodoList=[];
            this.totalTodoList = data["data"];
            if (this.totalTodoList) {
              for (let todo of this.totalTodoList) {
                if (todo.statusSelected === "Open") {
                  this.todoList.push(todo);
                }
               
                else if (todo.statusSelected === "Done") {
                  this.completedTodoList.push(todo);
                }
              }
            }
            this.todoListLength= this.todoList.length;
            this.completedTodoListLength= this.completedTodoList.length;
            this.showSpinner = false;
          },
          error => {
            this.showSpinner = false;
            this.toastr.error("An error occured while fetching friend's todos")
          }
        );
      }
    }
    else {
      this.todoList = [];
      this.showSpinner = false;
    }
  }

  public show() {
    this.showCompletedTodoList = !this.showCompletedTodoList;
  }

  public markComplete(todoId, todoTitle) {
    this.showSpinner = true;
    this.editedBy = {
      userId: this.cookie.get('userId'),
      userName: this.cookie.get('userName')
    }
    let todoData = {
      title: todoTitle,
      statusSelected: "Done",
      editedBy: this.editedBy
    }
    this.todoHttpService.editTodo(todoId, todoData).subscribe(
      data => {
        this.showSpinner = false;
        this.socketService.onGetNotification({ data: data.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        setTimeout(() => {
          this.getFriendsTodos();
        }, 100);
      },
      error => {
        this.showSpinner = false;
        this.toastr.error("Error in posting todo");
        
      }
    );

    setTimeout(() => {
      this.getSingleUserInformation();
    }, 100);
  }

  public markOpen(todoId, todoTitle) {
    this.showSpinner = true;
    this.editedBy = {
      userId: this.cookie.get('userId'),
      userName: this.cookie.get('userName')
    }
    let todoData = {
      title: todoTitle,
      statusSelected: "Open",
      editedBy: this.editedBy
    }
    this.todoHttpService.editTodo(todoId, todoData).subscribe(
      data => {
        this.showSpinner = false;
        this.socketService.onGetNotification({ data: data.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        
        setTimeout(() => {
          this.getSingleUserInformation();
        }, 100);
      },
      error => {
        this.showSpinner = false;
        this.toastr.error("Error in posting todo");
      }
    );
  }

  public deleteTodo(todoId) {
    this.showSpinner = true;
    this.todoHttpService.deleteTodo(todoId).subscribe(
      data => {
        this.showSpinner = false;
        this.socketService.onGetNotification({ data: data.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        setTimeout(() => {
          this.getSingleUserInformation();
        }, 1000);
      },
      error => {
        this.showSpinner = false;
        this.toastr.error("Error in deleting todo");
        
      }
    );
  }

}
