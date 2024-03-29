import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  public userImage = 'assets/images/others/admin.jpg';
  currentUser: any;

  constructor(public accountService:AccountService, public router:Router) { 
    this.currentUser = this.accountService.getUserInfo();
  }

  ngOnInit(): void {

  }

  signOut(){
    this.accountService.logout();
    this.router.navigate(['/sign-in']);
  }

}
