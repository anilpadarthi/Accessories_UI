import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';

@Injectable()
export class AccountService {
  constructor(private router: Router) {}

  public setSession(key: string){
    localStorage.setItem('token',key);
  }
  public getSession(){
   return localStorage.getItem('token');
  }

  public setUserInfo(user: any){
    localStorage.setItem('user',JSON.stringify(user));
  }
  public getUserInfo(){
    const userInfo: string | null = localStorage.getItem('user');
    return userInfo ? JSON.parse(userInfo): null;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
