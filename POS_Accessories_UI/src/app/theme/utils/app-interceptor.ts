import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor( private spinner: NgxSpinnerService) {}
  
    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show();
        //TODO: Generate token dynamically
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoie1wiVXNlcklkXCI6MSxcIlVzZXJUeXBlXCI6XCJhZG1pblwiLFwiRW1haWxcIjpcImFkbWluQGdtYWlsLmNvbVwiLFwiVXNlck5hbWVcIjpcImFkbWluXCIsXCJQYXNzd29yZFwiOlwiMTIzNFwifSIsIm5iZiI6MTY3NDEwMDA2NywiZXhwIjoxNjc0MTQzMjY3LCJpYXQiOjE2NzQxMDAwNjcsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcxNTIvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzE1Mi8ifQ.I1PdjpC4qTnfsYWQWS1IDHJ7C-Y5_wbaeyjzag8faw0";
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