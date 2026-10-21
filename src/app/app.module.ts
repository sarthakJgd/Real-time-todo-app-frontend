import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { UserModule } from './user/user.module';


import { RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found/page-not-found.component';
import { PageNotFoundModule } from './page-not-found/page-not-found.module';
import { SingleUserModule } from './single-user/single-user.module';
import { ErrorComponent } from './single-user/error/error.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        UserModule,
        PageNotFoundModule,
        SingleUserModule,
        NgxPaginationModule,
        MatSnackBarModule,
        RouterModule.forRoot([
            { path: "", redirectTo: "login", pathMatch: "full" },
            { path: "*", component: PageNotFoundComponent, pathMatch: "full" },
            { path: "page-not-found", component: PageNotFoundComponent, pathMatch: "full" },
            { path: "**", component: LoginComponent, pathMatch: "full" },
        ], {})], providers: [provideHttpClient(withXhr(), withInterceptorsFromDi())] })
export class AppModule { }
