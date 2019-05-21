import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from 'src/app/socket.service';
import { MatSnackBar } from '@angular/material';
import { ErrorComponent } from '../error/error.component';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css']
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
  durationInSeconds:number = 2;
  
  p1: number = 1;
  p2: number = 1;
  p3: number = 1;
  p4: number = 1;
  allUsersTotal1: any = [];
  allUsersTotal2: any = [];
  allUsersTotal3: any = [];
  allUsersTotal4: any = [];

  constructor(private cookie: CookieService,
    private router: Router,
    private appService: AppService,
    private toastr: ToastrService,
    private socketService: SocketService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userId = this.cookie.get('userId');
    this.userName = this.cookie.get('userName');
    this.authToken = this.cookie.get('authtoken');
   /*  console.log('the auth token: ' + this.authToken);
    console.log("logged in user\n" + this.userId + ' ' + this.userName); */
    this.checkStatus();
    this.getSingleUserInformation();
    this.getAllUser();

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
       /*  console.log(apiResponse); */
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
       /*  console.log(apiResponse); */
        this.toastr.error("Error occured while send friend request!")
      }
    });
  }

  public getSingleUserInformation() {
    this.appService.getSingleUserInformation(this.userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
       /*  console.log("Single User Info fetched!");
        console.log(apiResponse); */
        this.currentUserId=[this.userId];
        /* console.log(this.currentUserId); */
        this.friendList = apiResponse.data.friendsList;
        if (this.friendList.length != 0) {
          this.friendListIds = this.friendList.map((friend) => friend.friendId);
         
        }
        this.friendsListLength = this.friendList.length;
        /* console.log('length: ' + this.friendsListLength); */
        this.sentRequests = apiResponse.data.sentRequests;

        /* console.log('sent request ', apiResponse.data.sentRequests); */
        this.sentRequestsLength = this.sentRequests.length;
        if (this.sentRequests.length != 0) {
          this.sentRequestIds = this.sentRequests.map((sentRequest) => sentRequest.userId);
          /* console.log(this.sentRequestIds); */
        }
        /* console.log(this.sentRequestIds)
        console.log('friend list ', apiResponse.data) */
        this.receivedRequests = apiResponse.data.receivedRequests;
        this.receivedRequestsLength = this.receivedRequests.length;
        if (this.receivedRequests.length != 0) {
          this.receivedRequestIds = this.receivedRequests.map((friend) => friend.userId);
        }
        this.totalRequest = apiResponse.data.totalRequest;
      } else {
        /* console.log(apiResponse); */
        this.toastr.error("Error while fetching single user info")
      }
    })
  }


  public getAllUser() {
    this.appService.getAllUsers().subscribe(
      data => {
        /* console.log(data); */
        this.allUsersTotal = data.data;
        /* 
        console.log("allusers"+this.allUsersTotal); */
        /* console.log('all users', this.allUsers) */

        if (this.allUsersTotal && this.allUsersTotal.length !== 0) {
          if (this.currentUserId && this.currentUserId.length !== 0) {
            for (let i of this.currentUserId) {
              this.allUsersTotal1 = this.allUsersTotal.filter((values) => values.userId !== i)
              /* console.log('users', this.allUsers); */

            }
          }
          else{
            this.allUsersTotal1 = this.allUsersTotal;
          }
          /* console.log("alluserstotal 1"+this.allUsersTotal1); */
        }
        

        if (this.allUsersTotal1 && this.allUsersTotal1.length !== 0) {
          if (this.sentRequestIds && this.sentRequestIds.length !== 0) {
            for (let i of this.sentRequestIds) {
              this.allUsersTotal2 = this.allUsersTotal1.filter((values) => values.userId !== i)
              /* console.log('users', this.allUsers);
 */
            }
          }
          else{
            this.allUsersTotal2 = this.allUsersTotal1;
          }
          /* console.log("alluserstotal 2"+this.allUsersTotal2); */
        }

        if (this.allUsersTotal2 && this.allUsersTotal2.length !== 0) {
          if (this.receivedRequestIds && this.receivedRequestIds.length !== 0) {
            for (let i of this.receivedRequestIds) {
              this.allUsersTotal3 = this.allUsersTotal2.filter((values) => values.userId !== i)
              /* console.log('users', this.allUsers);
 */
            }
          }
          else{
            this.allUsersTotal3 = this.allUsersTotal2;
          }/* 
          console.log("alluserstotal 3"+this.allUsersTotal3); */
        }

        if (this.allUsersTotal3 && this.allUsersTotal3.length !== 0) {
          if (this.friendListIds && this.friendListIds.length !== 0) {
            for (let i of this.friendListIds) {
              this.allUsersTotal4 = this.allUsersTotal3.filter((values) => values.userId !== i)
              /* console.log('users', this.allUsers); */
              
            }
          }
          else{
            this.allUsersTotal4 = this.allUsersTotal3;
          }
          /* console.log("alluserstotal 4"+this.allUsersTotal4); */
        }

       if(this.allUsersTotal4 && this.allUsersTotal4.length !== 0){
        this.allUsers = this.allUsersTotal4;
        /* console.log("allusers"+this.allUsers); */
        this.allUsersLength = this.allUsers.length;
       }
        
        
       /*  console.log('all users length'+this.allUsersLength) */
      },
      err => {
       /*  console.log(err); */
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
    /* console.log('requestorId ' + reqUserId + '\nrequestorName ' + reqUserName+ '\nrequestedId ' +
      this.userId + '\nrequestedId ' + this.userName);
 */
    this.appService.acceptFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        /* console.log(apiResponse); */
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
        /* console.log(apiResponse); */
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
   /*  console.log('requestorId ' + reqUserId + '\nrequestorName ' + reqUserName+ '\nrequestedId ' +
      this.userId + '\nrequestedId ' + this.userName); */

    this.appService.rejectFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
       /*  console.log(apiResponse); */
        this.toastr.success("Friend Request rejected!");
        this.getSingleUserInformation();
        this.getAllUser();
      } else {
        /* console.log(apiResponse); */
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
    /* console.log('requestorId ' + reqUserId + '\nrequestorName ' + reqUserName+ '\nrequestedId ' +
      this.userId + '\nrequestedId ' + this.userName); */

    this.appService.rejectFriendRequest(friendRequest).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        /* console.log(apiResponse); */
        this.toastr.success("Friend Request deleted");
        this.getSingleUserInformation();
        this.getAllUser();
      } else {
       /*  console.log(apiResponse); */
        this.toastr.error("Error occured while rejecting friend request!")
      }
    });
  }
  

}
