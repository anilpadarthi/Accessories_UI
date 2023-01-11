import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings, Settings } from 'src/app/app.settings';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public settings: Settings;
  constructor(public appSettings:AppSettings, public router:Router) {
    this.settings = this.appSettings.settings;  
  }

  ngOnInit(): void {
    this.settings.rtl = false;
  } 

  public getDemo(number){
    if(number == 1){ 
      this.settings.theme = 'green';
      this.settings.rtl = false;
      this.router.navigate(['/']);
    }
    if(number == 2){ 
      this.settings.theme = 'green';
      this.settings.rtl = true;
      this.router.navigate(['/']);
    }
    if(number == 3){
      this.settings.theme = 'blue';
      this.settings.rtl = false;
      this.router.navigate(['/admin']);
    }
    if(number == 4){
      this.settings.theme = 'blue';
      this.settings.rtl = true;
      this.router.navigate(['/admin']);
    }  
  }

  public getSkin(num){
    if(num == 1){
      this.settings.theme = 'blue'; 
    }
    if(num == 2){
      this.settings.theme = 'green'; 
    }
    if(num == 3){
      this.settings.theme = 'red'; 
    }
    if(num == 4){
      this.settings.theme = 'pink'; 
    }
    if(num == 5){
      this.settings.theme = 'purple'; 
    }
    if(num == 6){
      this.settings.theme = 'grey';  
    } 
    this.settings.rtl = false; 
    this.router.navigate(['/']);
  }


  public scrollToDemos() {
    var elmnt = document.getElementById("demos");
    elmnt.scrollIntoView({behavior: "smooth"});
  }
  public goToTop(){
    var elmnt = document.getElementById("top");
    elmnt.scrollIntoView({behavior: "smooth"});
  }

}
