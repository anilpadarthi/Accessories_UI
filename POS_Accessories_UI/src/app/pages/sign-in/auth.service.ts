import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
//import { EnvService } from 'src/app/env.service';
import { User } from './user';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  baseURL: string;
  
  //baseURL = "https://localhost:44352/api/";
  
  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router, public _httpClient: HttpClient ) {
    this.baseURL = `${environment.apiUrl}/api/`;
  }

  AuthorizeUser(email: string, password: string): Observable<any>{
    return this._httpClient.get<any>( this.baseURL +`Login/Authenticate?email=${email}&password=${password}`);
  }
  ForgotPassword(username: string): Observable<any>{
    return this._httpClient.get<any>(`Login/ForgotPassword?username=${username}`);
  }
  ResetPassword(guid: string, password: string): Observable<any>{
    return this._httpClient.get<any>(`Login/ResetPassword?guid=${guid}&password=${password}`);
  }
  
  login(user: User) {
    if (user.userName !== '' && user.password !== '' ) {
      this.loggedIn.next(true);
      this.router.navigate(['/admin']);
    }
  }
}