import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { NotificationService } from 'src/app/notification.service';
import { SocketService } from 'src/app/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorComponent } from '../error/error.component';

@Component({
    selector: 'app-friend-list',
    templateUrl: './friend-list.component.html',
    styleUrls: ['./friend-list.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FriendListComponent implements OnInit {
  
  allUsers: any = [];
  allUsersTotal: any = [];
  userId: any;
  userName: any;
  authToken: any;
  friendList: any = [];
  sentRequests: any = [];
  receivedRequests: any = [];
  totalRequest: any;
  friendsListLength: any;
  sentRequestIds: any;
  friendListIds: any = [];
  sentRequestsLength: any;
  receivedRequestsLength: any;
  receivedRequestIds: any;
  allUsersLength: number;
  currentUserId: any= [];
  durationInSeconds = 2;
  color:any="primary";
  mode:any="indeterminate";
  value:any;
  
  p1 = 1;
  p2 = 1;
  p3 = 1;
  p4 = 1;
  allUsersTotal1: any = [];
  allUsersTotal2: any = [];
  allUsersTotal3: any = [];
  allUsersTotal4: any = [];

  constructor(private cookie: CookieService,
    private router: Router,
    private appService: AppService,
    private toastr: NotificationService,
    private socketService: SocketService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.cookie.get('userId');
    this.userName = this.cookie.get('userName');
    this.authToken = this.cookie.get('authtoken');
    this.checkStatus();
    this.getSingleUserInformation();
    /* this.getAllUser(); */

  }

  public checkStatus: any = () => {

    if (this.cookie.get('authtoken') === undefined || this.cookie.get('authtoken') === '' || this.cookie.get('authtoken') === null) {

      this.router.navigateByUrl('/');

      return false;

    } else {

      return true;

    }

  } // end checkStatus

  sendFriendRequest(reqUserId, reqUserName) {

    let friendRequest = {
      requestorId: this.userId,
      requestorName: this.userName,
      requestedId: reqUserId,
      requestedName: reqUserName
    }
    /* console.log('requestorId ' + this.userId + '\nrequestorName ' + this.userName + '\nrequestedId ' +
      friendRequest.requestorId + '\nrequestedId ' + friendRequest.requestedName); */

    this.appService.sendFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.socketService.onGetNotification({data: apiResponse.message});
          this.socketService.onShow().subscribe((data) => {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: data.data },
              panelClass: ["success"],
              verticalPosition: "top"
            });
          })
        //this.toastr.success(apiResponse.message);
        this.getSingleUserInformation();
        this.getAllUser();
      } else {
        this.toastr.error("Error occured while send friend request!")
      }
    });
  }

  public getSingleUserInformation() {
    this.appService.getSingleUserInformation(this.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.friendList = apiResponse.data.friendsList || [];
        this.friendsListLength = this.friendList.length;
        this.sentRequests = apiResponse.data.sentRequests || [];
        this.sentRequestsLength = this.sentRequests.length;
        this.receivedRequests = apiResponse.data.receivedRequests || [];
        this.receivedRequestsLength = this.receivedRequests.length;
        this.totalRequest = apiResponse.data.totalRequest || 0;
        this.getAllUser();
      } else {
        this.toastr.error("Error while fetching single user info")
      }
    })
  }


  public getAllUser() {
    this.appService.getAllUsers().subscribe(
      data => {
        this.allUsers = data.data;
        for(let i in this.allUsers){
          if(this.allUsers[i].userId === this.userId){
            let k = parseInt(i);
              this.allUsers.splice(k, 1);
          }
        }
        for (let i in this.allUsers) {
          for (let j in this.friendList) {
            if (this.allUsers[i].userId === this.friendList[j].friendId) {
              let k = parseInt(i);
              this.allUsers.splice(k, 1);
            }
          }
        }
        for (let i in this.allUsers) {
          for (let j in this.receivedRequests) {
            if (this.allUsers[i].userId === this.receivedRequests[j].userId) {
              let k = parseInt(i);
              this.allUsers.splice(k, 1);
            }
          }
        }
        for (let i in this.allUsers) {
          for (let j in this.sentRequests) {
            if (this.allUsers[i].userId === this.sentRequests[j].userId) {
              let k = parseInt(i);
              this.allUsers.splice(k, 1);
            }
          }
        }
        this.allUsersLength = this.allUsers.length;
      },
      err => {
       
        this.toastr.error("an error occured while fetching todos");
      }
    );
  }

  public acceptFriendRequest(reqUserId, reqUserName){
    let friendRequest = {
      requestorId: reqUserId,
      requestorName: reqUserName,
      requestedId: this.userId,
      requestedName: this.userName
    }
    
    this.appService.acceptFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.socketService.onGetNotification({data: apiResponse.message});
          this.socketService.onShow().subscribe((data) => {
            this.snackBar.openFromComponent(ErrorComponent, {
              duration: this.durationInSeconds * 1000,
              data: { message: data.data },
              panelClass: ["success"],
              verticalPosition: "top"
            });
          })
        
        this.getSingleUserInformation();
        this.getAllUser();
      } else {
        
        this.toastr.error("Error occured while sending friend request!")
      }
    });
    
  }

  public rejectFriendRequest(reqUserId, reqUserName){
    let friendRequest = {
      requestorId: reqUserId,
      requestorName: reqUserName,
      requestedId: this.userId,
      requestedName: this.userName
    }

    this.appService.rejectFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        this.toastr.success("Friend Request rejected!");
        this.getSingleUserInformation();
        this.getAllUser();
      } else {
        this.toastr.error("Error occured while rejecting friend request!")
      }
    });
  }

  public deletePendingFriendRequest(reqUserId, reqUserName){
    let friendRequest = {
      requestorId: this.userId,
      requestorName: this.userName,
      requestedId: reqUserId,
      requestedName: reqUserName
    }
    
    this.appService.rejectFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
    
        this.toastr.success("Friend Request deleted");
        this.getSingleUserInformation();
        this.getAllUser();
      } else {
       
        this.toastr.error("Error occured while rejecting friend request!")
      }
    });
  }
  

}
