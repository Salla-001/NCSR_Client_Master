import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { UserPasswordComponent } from './user-password/user-password.component';



@NgModule({
  declarations: [
    UserLoginComponent,
    UserRegistrationComponent,
    UserPasswordComponent
  ],
  imports: [
    CommonModule,
    FormsModule  
  ],
  exports:[
    UserLoginComponent,
    UserRegistrationComponent,
    UserPasswordComponent
  ]
})
export class UserModule { }
