import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from './user/user-registration/user-registration.component';
import { UploadFileComponent } from './trainee/upload-file/upload-file.component';

const routes: Routes = [
  {path:'',component:UploadFileComponent},
  {path:'registration',component:UserRegistrationComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
