import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AppSettings, Settings } from '../app.settings';
import { Router, NavigationEnd } from '@angular/router'; 
import { MenuService } from './components/menu/menu.service';
import { CartService } from '../shared/services/cart.service';

@Component({
  selector: 'app-leap',
  templateUrl: './leap.component.html',
  styleUrls: ['./leap.component.scss']
})
export class LeapComponent implements OnInit {
  @ViewChild('sidenav') sidenav:any;  
  public userImage = 'assets/images/others/admin.jpg'; 
  public settings:Settings;
  public menuItems:Array<any>;
  public toggleSearchBar:boolean = false;
  public hideSideNavUrl=['/products-view'];
  constructor(public appSettings:AppSettings, 
              public router:Router,
              private menuService: MenuService,
              public cartService: CartService){        
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {  
    if(window.innerWidth <= 960){ 
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    }; 
    setTimeout(() => {
      this.settings.theme = 'blue'; 
    });
    this.menuItems = this.menuService.getMenuItems();    
  }

  ngAfterViewInit(){  
    if(document.getElementById('preloader')){
      document.getElementById('preloader').classList.add('hide');
    } 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      } 
      if(window.innerWidth <= 960){
        this.sidenav.close(); 
      }                
    });  
    this.menuService.expandActiveSubMenu(this.menuService.getMenuItems());  
  } 

  public toggleSidenav(){
    this.sidenav.toggle();
  }

  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => {  
        window.scrollTo(0,0); 
      });
    }
  }

  isHideSideBar() {
		if (!this.router.url) {
			return false;
		}
		const index = this.hideSideNavUrl.indexOf(this.router.url);
		if (index >= 0) {
			return true; 
		} else {
			return false;
		}
	}

  @HostListener('window:resize')
  public onWindowResize():void {
    if(window.innerWidth <= 960){
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false; 
    }
    else{ 
      this.settings.adminSidenavIsOpened = true;
      this.settings.adminSidenavIsPinned = true;
    }
  }

}
