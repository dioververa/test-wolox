import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem("auth_token");
    console.log('intercept idToken: ', idToken);
    console.log('intercept req.headers: ', req.headers);

    if (idToken) {
      const cloned = req.clone({
        headers: req.headers.set("x-access-token", idToken)
      });
      console.log('intercept cloned: ', cloned);

      return next.handle(cloned).pipe(
        tap((event: HttpEvent<any>) => {
          console.log('intercept handle event: ', event);
          if (event instanceof HttpResponse) {
            if (event.body) {
              let response = event.body;
              if (response.error) {

              }
            }
          }
        }, (err: any) => {
          console.log('intercept handle err: ', err);
          if (err instanceof HttpErrorResponse) {
          }
        })
      )
    }
    else {
      return next.handle(req);
    }
  }
}