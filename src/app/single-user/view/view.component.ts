import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { TodoService } from 'src/app/todo.service';
import { DatePipe } from '@angular/common';
import { TodoHttpService } from 'src/app/todo-http.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  myTodoId: any;
  currentTodo: any;
  authToken: string;
  userInfo: any;
  durationInSeconds: number = 2;
  color:any="primary";
  mode:any="indeterminate";
  value:any;

  constructor(private _route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
    private datePipe: DatePipe,
    private todoHttpService: TodoHttpService,
    private toastr: ToastrService,
    private cookie: CookieService,
    private appService: AppService,
    private socketService: SocketService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.authToken = this.cookie.get('authtoken');

    this.userInfo = this.appService.getUserInfoFromLocalStorage();

    

    this.checkStatus();
    this._route.paramMap.subscribe((param: ParamMap) => {
      
      if (param.has('id')) {
        this.myTodoId = param.get('id');
        
        this.getSingleTodoInformation();

      }
    });
  }

  public getSingleTodoInformation() {
    this.todoHttpService.getSingleTodoInformation(this.myTodoId).subscribe(

      data => {
       
        this.currentTodo = data.data;
        if(this.currentTodo === null || this.currentTodo === undefined)
        this.router.navigateByUrl('page-not-found');
        
      },
      error => {
        
        this.toastr.error(error.message);
        this.router.navigateByUrl('page-not-found');
      }
    );
  }

  goBackToPreviousPage() {
    window.history.back();
  }

  public checkStatus: any = () => {

    if (this.cookie.get('authtoken') === undefined || this.cookie.get('authtoken') === '' || this.cookie.get('authtoken') === null) {

      this.router.navigateByUrl('/');

      return false;

    } else {

      return true;

    }

  } // end checkStatus

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
        
        setTimeout(() => {
          this.router.navigate(["single-user/todo"])
        }, 1000);
      },
      error => {
        this.toastr.error("Error in deleting todo");
        
      }
    );
  }

  undoTodoState(todoId) {
    this.todoHttpService.undoTodoState(todoId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.socketService.onGetNotification({ data: apiResponse.message });
        this.socketService.onShow().subscribe((data) => {
          this.snackBar.openFromComponent(ErrorComponent, {
            duration: this.durationInSeconds * 1000,
            data: { message: data.data },
            panelClass: ["success"],
            verticalPosition: "top"
          });
        })
        
        setTimeout(() => {
          this.getSingleTodoInformation();
          
        }, 100);
      }
      else {
        this.toastr.error(apiResponse.message);
        
        setTimeout(() => {
          this.getSingleTodoInformation();
         
        }, 100);
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode == 90)
      this.undoTodoState(this.myTodoId);
  }

}