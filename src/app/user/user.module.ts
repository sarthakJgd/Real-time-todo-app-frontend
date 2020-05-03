import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import {RouterModule, Routes} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {CookieService} from 'ngx-cookie-service'; 
import { MatIconModule, MatProgressSpinnerModule } from '@angular/material';

import {ToastrModule} from 'ngx-toastr';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [LoginComponent, SignupComponent, ForgotPasswordComponent, UserHeaderComponent, ThankYouComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    ToastrModule.forRoot(),
    MatProgressSpinnerModule,
    RouterModule.forChild([
      {path:"sign-up",component:SignupComponent},
      {path:"forgot-password",component:ForgotPasswordComponent},
      {path:"thank-you", component: ThankYouComponent},
      {path: "resetpassword/:userId", component: ResetPasswordComponent}
    ])
  ],
  providers : [CookieService]
})
export class UserModule { }
