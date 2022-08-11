import { Component, OnInit } from '@angular/core';
import { LoginRegisterModalService } from 'src/app/shared/services/login-register-modal.service';
import { AuthhService } from 'src/app/shared/services/auth/authh.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form!: FormGroup;

  public error: any = [];

  isSuccessful: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string = '';

  constructor(
    public serv: LoginRegisterModalService,
    private authhService: AuthhService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      fname: new FormControl('', Validators.required),
      lname: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      password_confirmation: new FormControl('', Validators.required),
      email_verif_status: new FormControl(false),
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    /*this.authhService.register(this.form.value).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );*/

    this.authhService.register(this.form.value).subscribe(
      data => this.handleRegisterResponse(data),
      error => this.handleError(error)
    );
  }

  handleRegisterResponse(data: any) {
    console.log(data);
    this.toastr.success('You are successfully registered!', 'Welcome '+this.form.value.fname+'!');
    this.router.navigateByUrl('/verification-request'); //profile-settings
  }

  handleError(error: any) {
    if(error !== null) {
      //this.error[0] = error.error.errors.email;
      //this.error[1] = error.error.errors.password;
      console.log(error);
      this.toastr.error(this.error.errors.email[0], 'Error Occured!');
    }

  }

}
