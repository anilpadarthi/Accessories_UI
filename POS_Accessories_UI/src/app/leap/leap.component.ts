import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { AppSettings, Settings } from "../app.settings";
import { Router, NavigationEnd } from "@angular/router";
import { MenuService } from "./components/menu/menu.service";
import { CartService } from "../shared/services/cart.service";
import { AccountService } from "../shared/services/account.service";

@Component({
  selector: "app-leap",
  templateUrl: "./leap.component.html",
  styleUrls: ["./leap.component.scss"],
})
export class LeapComponent implements OnInit {
  @ViewChild("sidenav") sidenav: any;
  public userImage = "assets/images/others/admin.jpg";
  public settings: Settings;
  public menuItems: Array<any>;
  public roleBasedMenus: Array<any> = [];
  public toggleSearchBar: boolean = false;
  public hideSideNavUrl = ["/order-create", "/products-view"];

  public userRoles;
  public currentUser;

  cartData: any;

  constructor(
    public appSettings: AppSettings,
    public router: Router,
    private menuService: MenuService,
    public cartService: CartService,
    private accountService: AccountService
  ) {
    this.settings = this.appSettings.settings;
    this.userRoles = this.menuService.getUserRoles();
    this.currentUser = this.accountService.getUserInfo();

    this.cartService.dataSubject$.subscribe(item => {
      if(item){
        this.cartData = item;
      }
    })

  }

  ngOnInit() {
    if (window.innerWidth <= 960) {
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    }
    setTimeout(() => {
      this.settings.theme = "blue";
    });
    this.menuItems = this.menuService.getMenuItems();
    this.filterMenus();
  }

  //Display Menus based on Roles
  filterMenus(){
    const filteredMenus = [];
    this.menuItems.forEach((element, index) => {
      if(element.title && element.icon !== 'view_list'){
        const isMenuExists = this.userRoles[element.title]?.indexOf(this.currentUser.userRoleId) !== -1
        if(isMenuExists){
          filteredMenus.push(element);
          if(element.parentId){
            const parentMenu = this.menuItems.find(item => item.id === element.parentId);
            const parentMenuExists = filteredMenus.filter(item => item.id === parentMenu?.id)
            if(parentMenuExists.length === 0){
              filteredMenus.push(parentMenu);
            }
          }
        }
      } 
    });
    this.roleBasedMenus = filteredMenus;
  }

  ngAfterViewInit() {
    if (document.getElementById("preloader")) {
      document.getElementById("preloader").classList.add("hide");
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
      if (window.innerWidth <= 960) {
        this.sidenav.close();
      }
    });
    this.menuService.expandActiveSubMenu(this.menuService.getMenuItems());
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }

  public scrollToTop() {
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset / (scrollDuration / 20);
    var scrollInterval = setInterval(() => {
      if (window.pageYOffset != 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  isHideSideBar() {
    var isHide = false;
    if (!this.router.url) {
      isHide = false;
    }
    for (let url of this.hideSideNavUrl) {
      const index = this.router.url.indexOf(url);
      if (index >= 0) {
        isHide = true;
        break;
      } else {
        isHide = false;
      }
    }
    return isHide;
  }

  @HostListener("window:resize")
  public onWindowResize(): void {
    if (window.innerWidth <= 960) {
      this.settings.adminSidenavIsOpened = false;
      this.settings.adminSidenavIsPinned = false;
    } else {
      this.settings.adminSidenavIsOpened = true;
      this.settings.adminSidenavIsPinned = true;
    }
  }
}
