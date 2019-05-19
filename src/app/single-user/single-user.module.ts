import { EditComponent } from './edit/edit.component';
import { CreateComponent } from './create/create.component';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CommonModule, DatePipe } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatTabsModule} from '@angular/material/tabs';
import { HeaderComponent } from './header/header.component';
import { ViewComponent } from './view/view.component';
import { FriendListComponent } from './friend-list/friend-list.component';
import {MatCardModule} from '@angular/material/card';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import { MultiUserComponent } from './multi-user/multi-user.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ErrorComponent } from './error/error.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found/page-not-found.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [EditComponent, CreateComponent, HeaderComponent, ViewComponent, FriendListComponent, MultiUserComponent, ErrorComponent],
  imports: [CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatSelectModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatBadgeModule,
    MatSnackBarModule ,
    MatMenuModule,
    NgxPaginationModule,
    RouterModule.forChild([
      { path: 'single-user/todo', component: CreateComponent},
      { path: 'single-user/todo/view/:id', component: ViewComponent},
      { path: 'single-user/todo/edit/:id', component: EditComponent},      
      { path: 'friend-list', component: FriendListComponent},
      { path: 'multi-user/todo', component: MultiUserComponent},
      { path: 'multi-user/todo/view/:id', component: ViewComponent},
      { path: 'multi-user/todo/edit/:id', component: EditComponent},
      { path: 'page-not-found', component: PageNotFoundComponent}      
    ])
  ],
 
  providers: [
    MatDatepickerModule,
    DatePipe
  ],
  
})
export class SingleUserModule { }
