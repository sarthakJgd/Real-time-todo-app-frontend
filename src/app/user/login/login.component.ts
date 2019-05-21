import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email: any;  
  public password: any;  

  constructor(public appService:AppService, 
    public router:Router,
    private toastr: ToastrService, 
    vcr: ViewContainerRef, 
    private cookieService: CookieService) {}

  ngOnInit() {
  }

  
  public signinFunction :any = () =>{
    if(!this.email){
      this.toastr.warning('enter email');
    }
    else if(!this.password){
      this.toastr.warning('enter password');
    }
    else{
        let data = {
          email: this.email,
          password : this.password
        }

        this.appService.signInFunction(data).subscribe(
          data =>{
            
           
            this.cookieService.set('authtoken', data.data.authToken);
            
            this.cookieService.set('userId', data.data.userDetails.userId);
            
            this.cookieService.set('userName', data.data.userDetails.firstName + ' ' + data.data.userDetails.lastName);
          
            
            this.toastr.success("Login Successful!")
            
            this.router.navigate(['single-user/todo']);     
           
          },
          err=>{
            this.toastr.error(err.error.message);
          }
        )}
    
}

goToForgotPassword(){
  this.router.navigateByUrl("forgot-password")
}

goToSignUp(){
  this.router.navigateByUrl("sign-up");
}

}
