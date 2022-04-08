import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Md5 } from 'md5-typescript';

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent implements OnInit {

  password: any;
  confirmPassword: any;

  errMsg: any;

  @Output() onValidInput: EventEmitter<string> = new EventEmitter<string>();
  @Output() onInvalidInput: EventEmitter<undefined> = new EventEmitter<undefined>()

  constructor() { }

  ngOnInit(): void {
  }

  validate() {
    this.errMsg = undefined;

    if(!this.isComplex(this.password)){
this.errMsg = `
The Password must meet the following requirements:
        <ul>
        <li>No whitespaces.</li>
        <li>At least 1 UPPERCASE letter.</li>
        <li>At least 1 lowercase letter.</li>
        <li>At least 1 digit.</li>
        <li>At least 1 non-alpha letter.</li>
        </ul>
        `;
    } else if(this.password !== this.confirmPassword){
       this.errMsg = 'password must match.'
    }
    if(this.errMsg){
      this.onInvalidInput.emit();
    }else{
      this.onValidInput.emit(Md5.init(this.password))
    }

  }

  isComplex(password: string) {
    const hasSpaces = /\s/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonAlphas = /\W/.test(password);

    if (!hasSpaces && hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas) {
      return true;
    } else {
      return false
    }

  }
}
