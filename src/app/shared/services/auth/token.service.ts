import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  handle(token: any, id: string = "") {
    this.setToken(token, id);
  }

  setEmail(email: string) {
    localStorage.setItem('usermail', email);
  }

  setUserRole(role: number) {
    let userRole;
    if ( role === 1 ) {
      userRole = 'admin';
    } else {
      userRole = 'user';
    }
    localStorage.setItem('role', userRole);
  }

  setToken(token: any, id: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', id);
  }

  getToken() {
    return sessionStorage.getItem('auth-token');
  }

  getUserId() {
    return sessionStorage.getItem('user_id');
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  removeEmail() {
    localStorage.removeItem('usermail');
  }

  isValid() {
    const token = this.getToken();
    if (token) {
      /*const payload = this.payload(token);
      if (payload) {
        return Object.values(this.iss).indexOf(payload.iss) > -1 ? true : false;
      }*/
      return true;
    }

    return false;

  }

  payload(token: any) {
    const payload = token.split('.')[1];
    return this.decode(payload);
  }

  decode(payload: any) {
    return JSON.parse(atob(payload));
  }

  loggedIn() {
    return this.isValid();
  }
}
