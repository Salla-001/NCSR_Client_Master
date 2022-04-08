import { Component, OnInit } from '@angular/core';
import { adminProfile } from 'src/app/data-model/login.entity';
import { loginService } from 'src/app/data-model/login.service';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  email: any;
  password: any;

  constructor(private lnService:loginService) { }

  login(event:any, form:any) {
    event.preventDefault();
    const user = new adminProfile();
    user.email = this.email;
    // if (this.password) {
    //   user.password = Md5.init(this.password);
    // }
    // if (user.email && user.password) {
    //   console.log('Login User: ', user);
    //   this.lnService.adminLogin(user)
    //     .subscribe(
    //       loginResult => {
    //         console.log('Login Result: ', loginResult);
    //         if (loginResult.status === this.userService.STATUS.PASS) {
    //           // APP_DATA.activeUser = loginResult.data;
    //           this.router.navigate(['/']);
    //         } else {
    //           alert('Problem in login. Try again.');
    //           this.router.navigate(['/user/login']);
    //         }
    //       }
    //     );
    // } else {
    //   alert('The Email ID and the Password must be correctly specified.');
    // }
  }

  ngOnInit(): void {
  }

}
