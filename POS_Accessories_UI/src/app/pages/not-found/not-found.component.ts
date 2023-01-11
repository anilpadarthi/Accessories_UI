import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit() {
  }

  public goHome(): void { 
    if(this.router.routerState.snapshot.url.includes("/admin")){
      this.router.navigate(['/admin']);
    }
    else{
      this.router.navigate(['/']);
    } 
  }

}
