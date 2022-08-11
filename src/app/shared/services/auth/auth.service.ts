import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from './token.service';

import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const Auth_API = environment.api;
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {



  constructor(
    private token: TokenService,
    private http: HttpClient
  ) { }

  private  loggedIn = new BehaviorSubject<boolean>(this.token.loggedIn())
  authStatus = this.loggedIn.asObservable();

  changeAuthStatus(value: boolean){
    this.loggedIn.next(value)
  }

  refreshToken(token: string) {
    return this.http.post(Auth_API+'refreshToken', {
      refreshToken: token
    }, httpOptions);
  }
}
