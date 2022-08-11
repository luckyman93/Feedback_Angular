import { HTTP_INTERCEPTORS, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { TokenStorageService } from "../shared/services/auth/token-storage.service";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AuthhService } from "../shared/services/auth/authh.service";
import { catchError, filter, switchMap, take } from "rxjs";



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(
    private token: TokenStorageService,
    private authhService: AuthhService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
      let authReq = req;
      const token = this.token.getToken();
      if(token != null) {
        authReq = req.clone({
          setHeaders: {
            // 'Content-Type' : 'application/json; charset=utf-8',
            // 'Accept'       : 'application/json',
            'Authorization' : 'Bearer '+this.token.getToken(),
          },
        })
        //authReq = req.clone({ headers: req.headers.set('x-access-token', 'Bearer ' + token) });
      }
      return next.handle(authReq).pipe(catchError(error => {

        if(error instanceof HttpErrorResponse && !authReq.url.includes('home') && error.status === 401) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const token = this.token.getRefreshToken();
      if (token)
        return this.authhService.refreshToken(token).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.token.saveToken(token.accessToken);
            this.refreshTokenSubject.next(token.accessToken);

            console.log('+++++++++++++++++++++++++++++++')

            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.token.signOut();
            return throwError(err);
          })
        );
    }
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set('x-access-token', 'Bearer ' + token) });
    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set('Authorization', 'Bearer '+token) });
  }
}

/*
export const authInterceptorProviders= [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];
*/

