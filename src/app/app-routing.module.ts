import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './main/leader/pages/start/start.component';
import { RegisterComponent } from './main/leader/pages/register/register.component';
import { EditComponent } from './main/leader/pages/edit/edit.component';
import { DetailComponent } from './main/leader/pages/detail/detail.component';

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
