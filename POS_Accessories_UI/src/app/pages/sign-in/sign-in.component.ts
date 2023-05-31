import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators,  FormBuilder, FormControl, FormGroup  } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import { AuthService } from './auth.service';
import { AccountService } from 'src/app/shared/services/account.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  loginForm: UntypedFormGroup;
  registerForm: UntypedFormGroup;

  constructor(
    public formBuilder: UntypedFormBuilder, 
    public router:Router, 
    public snackBar: MatSnackBar,
    private fb: FormBuilder,
      public authService: AuthService,
      private _jwt: AccountService
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])] 
    });

    this.registerForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, emailValidator])],
      'password': ['', Validators.required],
      'confirmPassword': ['', Validators.required]
    },{validator: matchingPasswords('password', 'confirmPassword')});

  }

  public onLoginFormSubmit(values:Object):void {
    // if (this.loginForm.valid) {
    //   this.router.navigate(['/']);
    // }
    if (this.loginForm.valid) {
      this.authService.AuthorizeUser(this.loginForm.value.email, this.loginForm.value.password).subscribe((res)=>{
        if (res.status) {    
          this._jwt.setSession(res.data.token);
          this._jwt.setUserInfo(res.data.user);
          this.router.navigate(['/']);
        }
      });
    }
  }

  public onRegisterFormSubmit(values:Object):void {
    if (this.registerForm.valid) {
      this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

}
