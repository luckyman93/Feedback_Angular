import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRegisterModalService } from 'src/app/shared/services/login-register-modal.service';

import { AuthhService } from 'src/app/shared/services/auth/authh.service';
import { TokenStorageService } from 'src/app/shared/services/auth/token-storage.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/services/auth/token.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  isLoggedIn: boolean = false;
  isLoginFailed: boolean = false;

  errorMessage: string = '';


  constructor(
    public serv: LoginRegisterModalService,
    private authhService: AuthhService,
    private token: TokenService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private Auth: AuthService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    if(this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  onSubmit(): void {
    this.authhService.login(this.form.value).subscribe(
      data => {
        this.tokenStorage.saveToken(data.access_token);
        this.tokenStorage.saveRefreshToken(data.refreshToken);
        this.tokenStorage.saveUser(data);
        sessionStorage.setItem('user_id', data.user._id);
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        //token service used for now
        this.token.handle(data.access_token, data.user._id);
        this.token.setUserRole(data.user.role);
        this.Auth.changeAuthStatus(true);

        this.router.navigateByUrl('/us');
        this.serv.displayLoginModal = false;



      },
      err => {
        console.log(err.error.message)
      }
    )
  }
}
