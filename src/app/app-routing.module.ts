import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './Content/start/start.component';
import { RegisterComponent } from './Content/register/register.component';
import { EditComponent } from './Content/edit/edit.component';
import { DetailComponent } from './Content/detail/detail.component';

const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'edit', component: EditComponent },
  { path: 'detail', component: DetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
