import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;  
  public lastName: any;  
  public email: any;  
  public mobileNumber: any;  
  public password: any;  
  public apiKey: any;  
  public selectedValue:any= "Country Code";
  isSelected:boolean = true;
  constructor(public appService:AppService, public router:Router,private toastr: ToastrService, vcr: ViewContainerRef) { }

  ngOnInit() {
  }

  public goToSignIn : any =() =>{
    this.router.navigate(['/']);
  }

  public signUpFunction : any = (signUpForm:NgForm) =>{
    if(!this.firstName){
      this.toastr.warning('enter first name');
    }
    else if(!this.lastName){
      this.toastr.warning('enter last name');
    }
    else if(!signUpForm.value.countryCode){
      this.toastr.warning('enter country code');
    }
    else if(!this.mobileNumber){
      this.toastr.warning('enter mobile number');
    }
    else if(!this.email){
      this.toastr.warning('enter email');
    }
    else if(!this.password){
      this.toastr.warning('enter password');
    }
    /* else if(!this.apiKey){
      this.toastr.warning('enter api Key');
    } */
    else{

      let data = {
        firstName : this.firstName,
        lastName : this.lastName,
        countryCode : signUpForm.value.countryCode,
        mobileNumber : this.mobileNumber,
        email : this.email,
        password : this.password,
        
      }

      

      this.appService.signUpFunction(data).subscribe((apiResponse)=>{
         

          if(apiResponse.status === 200){
            this.toastr.success("Sign up successful");
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);
          }
          else{
            this.toastr.error(apiResponse.message);
          }
      });
    }
  }

}
