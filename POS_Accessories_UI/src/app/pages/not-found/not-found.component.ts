import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  notAuthorized: boolean = false;

  constructor(public router: Router) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      const error = this.router.getCurrentNavigation()?.extras?.state?.error;
      if (error?.toLowerCase() === 'not authorized') {
        this.notAuthorized = true;
      }
    }
  }

  ngOnInit() {
  }

  public goHome(): void {
    if (this.router.routerState.snapshot.url.includes("/admin")) {
      this.router.navigate(['/admin']);
    }
    else {
      this.router.navigate(['/']);
    }
  }

}
