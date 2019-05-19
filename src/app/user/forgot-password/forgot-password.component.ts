import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordEmail:any;
  isSent:any;
  constructor(public toastr: ToastrService,
    public appService : AppService,
    public router: Router) { }

  ngOnInit() {
  }

  resetPassword() {
    if (!this.forgotPasswordEmail) {
      this.toastr.warning("Please enter your email Id");
    } else {
      this.appService.forgotPasswordSendMail(this.forgotPasswordEmail)
        .subscribe(
          apiResponse => {
           /*  console.log(apiResponse); */

            if (apiResponse.status === 200) {
              this.toastr.success("Password Reset Email has been sent");
              this.isSent = true;
              this.router.navigateByUrl('/');
            } else {
              this.toastr.error(apiResponse.message);
            }
          },
          err => {
            this.toastr.error("some error occured");
          }
        );
    }
  }

}
