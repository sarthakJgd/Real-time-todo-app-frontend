import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {

  }

  goToLogin(){
    this.router.navigateByUrl("/");
  }

  goToSignUp(){
    this.router.navigateByUrl("sign-up");
  }

  goToForgotPassword(){
    this.router.navigateByUrl("forgot-password")
  }
}
