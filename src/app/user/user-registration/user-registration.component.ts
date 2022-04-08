import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DEFAULT_ROLE, ROLES, User, UserProfile } from 'src/app/data-model/user.entity';
import { UserService } from 'src/app/data-model/user.service';
import { APP_DATA } from 'src/app/data-model/app.data';


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {

  user: User = new User;
  confirmPassword: any;
  profile: UserProfile = new UserProfile;
  role: any = DEFAULT_ROLE;

  constructor(
    protected userService: UserService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
  }  
  getRcode = ()=>{
    return "sfafasfasdfafdas"
  }
  register(event:any, form:any) {
    event.preventDefault();
    // input validation
    console.log('Registering User: ', this.user);
    if (!this.user.email
      || !this.user.password
    ) {
      alert('Email and Password are required.');
      return;
    }
    if (!this.profile.firstName
      || !this.profile.lastName
      || !this.profile.phoneNumber
      || !this.profile.address
    ) {
      alert('Please enter all the Registration field.');
      return;
    }
    // validate email id format
    const validEmailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!validEmailPattern.test(this.user.email)) {
      alert('Invalid email format.');
      return;
    }

    this.userService.registeruser(this.user, this.profile, this.role.id).subscribe(
      (result) => {
        console.log('User Registration Result: ', result);
        if (this.userService.isPass(result)) {
          // const emailData = {};
          // emailData['customer.email'] = this.user.email;
          // this.emailService.handleEvent('registration.completed', emailData).subscribe(emailResult => { });

          if (APP_DATA.activeUser) {
            this.router.navigate(['/user/profile', this.profile.id]);
          } else {
            this.userService.doLogin(this.user).subscribe(
              (loginResult:any) => {
                if (this.userService.isPass(loginResult)) {
                  this.router.navigate(['/']);
                } else {
                  alert('Problem in registration. Try again.');
                }
              }
            );
          }
        } else {
          alert('Problem in registration. Try again.');
        }
      }
    );
  }
  forValueCheck(event:any, form:any){
    console.log(this.profile)
  }
  
  user1:User = {
    id:"",
    email: "iprieddddd2.com",
    password: "sdfsdf",
    role: ''
  }
 
  UserProfile1:UserProfile = {
    id:"",
    email: "",
    password: "sdfsdf",
    role: '',
    firstName:"firstname",
    lastName:"lastName",
    phoneNumber:'252545354',
    address:"erwerwertwre",
    getFullName : () => {
      return `${this.UserProfile1.firstName ? this.UserProfile1.firstName : ""} ${this.UserProfile1.lastName ? this.UserProfile1.lastName : ""
        }`;
    }
    
        
  }

  check(){
    this.userService.registeruser(this.user1,this.UserProfile1).subscribe((result)=>{
      console.log(result)
          })
  }
  

  ngOnInit(): void {
    
  }

}
