import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TodoService } from 'src/app/todo.service';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TodoHttpService } from 'src/app/todo-http.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { SocketService } from 'src/app/socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error.component';


export interface iSubTask {
  taskValue: boolean;
  name: String;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public title: String;
  public description: String;
  public todoDate: Date;
  public reminderTime: Date;
  public subtask: iSubTask;
  public subtaskValue = false;
  public subtasks: iSubTask[] = [];
  public statusSelected: String;
  public comments: String;
  public j = 0;
  public todoList: any;
  public completedTodoList: any = [];
  public statuses: any = ["Open", "Done"];
  public step: any;
  public minDate = new Date();
  public authorId: any;
  public showCompletedTodoList: any = false;
  public todo: any;
  private myTodoId: String;
  private mode = 'create';
  public task: String;
  editedBy: any;
  durationInSeconds:number = 2;
 

  constructor(private _route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private datePipe: DatePipe,
    private cookie: CookieService,
    private todoHttpService: TodoHttpService,
    private toastr: ToastrService,
    private socketService: SocketService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.checkStatus();
    this.editedBy = {
      userId: this.cookie.get('userId'),
      userName: this.cookie.get('userName')
    }
    this._route.paramMap.subscribe((param: ParamMap) => {
      console.log(param);
      if (param.has('id')) {
        this.myTodoId = param.get('id');
        console.log("The todoId is:" + this.myTodoId);
        this.todoHttpService.getSingleTodoInformation(this.myTodoId).subscribe(

          data => {
            console.log(data);
            this.todo = data.data;
            console.log("title", this.todo.title);
            if (this.todo.title) {
              this.title = this.todo.title;
            } else {
              this.title = "";
            }
            //this.title = this.todo.title;
            if (this.todo.description) {
              this.description = this.todo.description;
            } else {
              this.description = "";
            }

            if (this.todo.todoDate) {
              this.todoDate = this.todo.todoDate;
            } else {
              this.todoDate = null;
            }

            if (this.todo.reminderTime) {
              this.reminderTime = this.todo.reminderTime;
            } else {
              this.reminderTime = null;
            }

            if (this.todo.subtasks) {
              this.subtasks = this.todo.subtasks;
            } else {
              this.subtasks = [];
            }


            if (this.todo.statusSelected) {
              this.statusSelected = this.todo.statusSelected;
            } else {
              this.statusSelected = "";
            }


            if (this.todo.comments) {
              this.comments = this.todo.comments;
            } else {
              this.comments = "";
            }
          },
          error => {
            console.log("Some error occured");
            console.log(error.message);
            this.router.navigate(["page-not-found"]);
          }
        );
      }
    })
  }

  public checkStatus: any = () => {

    if (this.cookie.get('authtoken') === undefined || this.cookie.get('authtoken') === '' || this.cookie.get('authtoken') === null) {

      this.router.navigateByUrl('/');

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  public onSubmit(todoForm: NgForm,todoId:Event) {
    let currentDate = new Date();
    /* console.log(this.statusSelected); */
    let todoData = {
      title: this.title,
      description: this.description,
      todoDate: this.todoDate,
      reminderTime: this.reminderTime,
      subtasks: this.subtasks,
      statusSelected: this.statusSelected,
      comments: this.comments,
      lastModified: currentDate,
      editedBy: this.editedBy,
      canDelete: true
    }
    /* console.log("Todo Data: " + todoData); */
    this.todoHttpService.editTodo(this.myTodoId, todoData).subscribe(

      data => {
        this.socketService.onGetNotification({data: data.message});
          this.socketService.onShow().subscribe((data) => {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: data.data },
              panelClass: ["success"],
              verticalPosition: "top"
            });
          })
        //this.toastr.success(data.message);
      /*   console.log(data); */
        this.todo = data.data;
       /*  console.log("edit todo response" + data.data); */
      },
      error => {
        this.toastr.error("Some error occured while editing");
     /*    console.log(error.message); */
      }
    );
    todoForm.reset();
    setTimeout(() => {
      this.router.navigate(["single-user/todo"])
    }, 100);
  }

  public enterUsingKeypress: any = (event: any) => {
    if (this.task) {
      this.task = this.task.trim();
    }
    if (event.keyCode === 13) { // 13 is keycode of enter.
      if (this.task) {
        this.subtask = {
          taskValue: false,
          name: this.task,
        }
        this.subtasks.push(this.subtask);
       /*  console.log(this.subtasks); */
        this.task = "";
      }
    }
  }

  public checkboxClicked(index) {
    /* for (let i = 0; i < this.subtasks.length; i++) {
      if (i == index) {
        this.subtasks[i].taskValue = !this.subtasks[i].taskValue;
      }
    } */
  /*   console.log(this.subtasks); */
  }

  public deleteSubtask(index){
    this.subtasks.splice(index,1);
  }
}
