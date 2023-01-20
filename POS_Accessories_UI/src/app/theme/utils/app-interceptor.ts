import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AccountService } from '../../../app/shared/services/account.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor( private spinner: NgxSpinnerService,
      private accountService: AccountService) {}
  
    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show();
        //TODO: Generate token dynamically
        const token = this.accountService.getSession();
        if (token) {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.spinner.hide();
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            const started = Date.now();            
            const elapsed = Date.now() - started;
            console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
           // debugger;
            return throwError(error);
          })
        );

    }  
}