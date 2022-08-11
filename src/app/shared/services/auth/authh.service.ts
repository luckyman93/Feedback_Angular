import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { thisQuarter } from '@igniteui/material-icons-extended';

const AUTH_API = environment.api;
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AuthhService {

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(AUTH_API+'sanctumlogin', data, httpOptions);
  }

  register(data: any): Observable<any> {
    return this.http.post(AUTH_API+'signup', data, httpOptions);
  }

  refreshToken(token: string) {
    return this.http.post(AUTH_API+'refresh', {
      refreshToken: token
    }, httpOptions);
  }
}
