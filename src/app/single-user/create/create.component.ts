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
import { PageEvent, MatSnackBar } from '@angular/material';
import { SocketService } from 'src/app/socket.service';
import { ErrorComponent } from '../error/error.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {



  public title: String;
  public todoList: any = [];
  public completedTodoList: any = [];
  public showCompletedTodoList: any = false;
  public createdBy: any;
  private jwt: any;
  step: number;
  userId: string;
  durationInSeconds: number = 2;
  editedBy: any;
  p1: number = 1;
  p2: number = 1;
  todoListLength: any = 0;
  completedTodoListLength:any = 0;
  totalTodoList: any = [];

  constructor(private todoService: TodoService,
    private todoHttpService: TodoHttpService,
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
    this.createdBy = {
      userId: this.cookie.get('userId'),
      userName: this.cookie.get('userName')
    }
    /* console.log("jwt:" + this.jwt); */
    this.getTodosByCreatedId();
  }

  public getTodosByCreatedId() {

    this.todoHttpService.getTodosByCreatedId().subscribe(
      data => {
       /*  console.log("response of getTodosByCreatedId")
        console.log("create page data" + data.data); */
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
      },
      error => {
        /* console.log("Some error occured");
        console.log(error.errorMessage); */
        this.toastr.error("error in fetching todos");
      }
    );

  }

  private getTodos() {
    this.todoHttpService.getAllTodos().subscribe(
      data => {
        /* console.log("create page data" + data.data); */
        this.todoList = data["data"];
      },
      error => {
        /* console.log("Some error occured");
        console.log(error.errorMessage); */
        this.toastr.error("error in gfetting todos");
      }
    );
  }

  public checkStatus: any = () => {

    if (this.cookie.get('authtoken') === undefined || this.cookie.get('authtoken') === '' || this.cookie.get('authtoken') === null) {

      this.router.navigateByUrl('/');

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  setStep(index: number) {
    this.step = index;
  }
  public show() {
    this.showCompletedTodoList = !this.showCompletedTodoList;
  }

  public onSubmit(todo: NgForm) {
    if (todo.value.title != null && todo.value.title != "") {
      todo.value.title = todo.value.title.trim();
    }
    if (todo.form.valid && todo.value.title != "") {
      let currentDate = new Date();
      /* console.log(currentDate.toLocaleString); */
      let todoData = {
        title: todo.value.title,
        description: "",
        todoDate: "",
        reminderTime: "",
        subtasks: null,
        statusSelected: "Open",
        comments: "",
        createdBy: this.createdBy,

      }
      /* console.log("Todo Data: " + todoData); */
      this.todoHttpService.createTodo(todoData).subscribe(
        data => {
          /* console.log(data.message); */
          this.socketService.onGetNotification({ data: data.message });
          this.socketService.onShow().subscribe((data) => {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: data.data },
              panelClass: ["success"],
              verticalPosition: "top"
            });
          })

          /* console.log(data); */
          setTimeout(() => {
            this.getTodosByCreatedId();
          }, 100);
        },
        error => {
          this.toastr.error("Error in posting todo");
         /*  console.log(error); */

        }

      )
      todo.reset();
    }
  }
  public markComplete(todoId, todoTitle) {
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
        this.socketService.onGetNotification({ data: data.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        //this.toastr.success("Todo marked as complete");
       /*  console.log(data); */
        setTimeout(() => {
          this.getTodosByCreatedId();
        }, 100);
      },
      error => {
        this.toastr.error("Error in posting todo");
        /* console.log(error); */
      }
    );

    setTimeout(() => {
      this.getTodosByCreatedId();

    }, 100);
  }

  public markOpen(todoId, todoTitle) {
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
        this.socketService.onGetNotification({ data: data.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        //this.toastr.success("Todo marked as open");
        /* console.log(data); */
        setTimeout(() => {
          this.getTodosByCreatedId();

        }, 100);
      },
      error => {
        this.toastr.error("Error in posting todo");
        /* console.log(error); */

      }
    );
  }

  public deleteTodo(todoId) {
    this.todoHttpService.deleteTodo(todoId).subscribe(
      data => {
        this.socketService.onGetNotification({ data: data.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        //this.toastr.success(data.message);
       /*  console.log(data); */
        setTimeout(() => {
          this.getTodosByCreatedId();

        }, 1000);
      },
      error => {
        this.toastr.error("Error in deleting todo");
        /* console.log(error); */
      }
    );

  }



}
