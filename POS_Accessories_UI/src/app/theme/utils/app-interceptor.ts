import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccountService } from '../../../app/shared/services/account.service';
import { Router } from '@angular/router'
@Injectable()
export class AppInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(private spinner: NgxSpinnerService,
    private accountService: AccountService, private router: Router) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.totalRequests++;
    this.spinner.show();

    const token = this.accountService.getSession();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    else {
      this.router.navigate(['/sign-in']);
    }

    return next.handle(req).pipe(map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.spinner.hide();
        }
      }
      return event;
    }),

      catchError((error: HttpErrorResponse) => {
        const started = Date.now();
        const elapsed = Date.now() - started;
        console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
        this.spinner.hide();
        if (error.status == 401) {
          this.router.navigate(['/sign-in']);
        }
        else {
          this.router.navigate(['/error']);
        }
        return throwError(error);
      })
    );

  }
}