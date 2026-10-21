import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent implements OnInit {
  userName: any;
  userId: string;
  receivedRequests: any;
  receivedRequestsLength = 0;

  constructor(public router: Router,
    private appService: AppService,
    public toastr: NotificationService,
    private cookie: CookieService) { }

  ngOnInit() {
    this.userName = this.cookie.get('userName');
    
    //this.getSingleUserInformation();
  }

  logout() {
    this.appService.logout().subscribe(
      data => {
        
        this.cookie.deleteAll();
        localStorage.clear();
        this.toastr.success("Log out successful !");
        setTimeout(() => {
          this.router.navigate(["thank-you"]);
        }, 100);

      }, error => {
        this.toastr.error("Error while logging out !");
       
      }
    );

  }

  goToSingleTodos() {
    this.router.navigateByUrl('single-user/todo');
  }

  goToSharedTodos() {
    this.router.navigateByUrl('multi-user/todo');
  }

  goToFriendsList() {
    this.router.navigateByUrl('friend-list');
  }

  public getSingleUserInformation() {
    this.userId = this.cookie.get('userId');
    this.appService.getSingleUserInformation(this.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.receivedRequests = apiResponse.data.receivedRequests;
        this.receivedRequestsLength = this.receivedRequests.length;
        
      } else {
        this.toastr.error("Error while fetching single user info")
      }
    })

  }
}
