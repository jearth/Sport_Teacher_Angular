import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartComponent } from './Content/start/start.component';
import { FooterComponent } from './Layout/footer/footer.component';
import { HeaderComponent } from './Layout/header/header.component';
import { SidebarComponent } from './Layout/sidebar/sidebar.component';
import { RegisterComponent } from './Content/register/register.component';
import { EditComponent } from './Content/edit/edit.component';
import { DetailComponent } from './Content/detail/detail.component';

import { MatDialogModule } from '@angular/material/dialog';
import { LeaderSearchComponent } from './Share/leader-search/leader-search.component';
import { SchoolSearchComponent } from './Share/school-search/school-search.component'

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    RegisterComponent,
    EditComponent,
    DetailComponent,
    LeaderSearchComponent,
    SchoolSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
