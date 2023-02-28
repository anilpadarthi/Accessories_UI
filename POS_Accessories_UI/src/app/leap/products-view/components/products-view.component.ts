import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from 'src/app/shared/services/product.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { Category } from "../../../shared/models/category";
import { Product } from "../../../shared/models/product";
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { SubCategory } from 'src/app/shared/models/subCategory';
import { SubCategoryService } from 'src/app/shared/services/subCategory.service';
import { LookupService } from 'src/app/shared/services/lookup.service';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';

@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  private sub: any;
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public counts = [12, 24, 36];
  public count:any;
  public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort:any;
  public products: Array<Product> = [];
  public categories:Category[] = [];
  public subCategories:SubCategory[] = [];
  public brands = [];
  public priceFrom: number = 750;
  public priceTo: number = 1599;
  public colors = [];
  public sizes = []; 
  public page:any;
  public settings: Settings;
  public showExtraFilter:boolean = false;
  constructor(public appSettings:AppSettings, 
              private activatedRoute: ActivatedRoute, 
              private lookupService:LookupService,
              public productService:ProductService,
              public categoryService:CategoryService,
              public subCategoryService:SubCategoryService,
              public dialog: MatDialog, 
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.count = this.counts[0];
    this.sort = this.sortings[0];
    this.sub = this.activatedRoute.params.subscribe(params => {
      //console.log(params['name']);
    });
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
    if(window.innerWidth < 1280){
      this.viewCol = 33.3;
    };

   this.getCategories();
   this.getAllProducts();  
   if(this.showExtraFilter){
      this.getColours();
      this.getSizes(); 
   }
  }

  public getAllProducts(){
    this.productService.getProductList().subscribe(res=>{
      this.products = res.data; 
      //TODO:remove this hardcodings
      this.products.forEach(a => {
        a.availibilityCount = 10;
        a.newPrice = a.productId *10;
        a.oldPrice = a.productId *10;
      })
      //for show more product  
      // for (var index = 0; index < 3; index++) {
      //   this.products = this.products.concat(this.products);        
      // }
    });
  }

  public getCategories(){  
      this.categoryService.getCategoryList().subscribe(res => {
        this.categories = res.data;
      });
  }

  getColours(){
    this.lookupService.getColours().subscribe(res => {
      this.colors = res.data;
    });
  }

  getSizes(){
    this.lookupService.getSizes().subscribe(res => {
      this.sizes = res.data;
    });
  }

  // public getBrands(){
  //   this.brands = this.appService.getBrands();
  //   this.brands.forEach(brand => { brand.selected = false });
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
  }

  public changeCount(count){
    this.count = count;
    this.getAllProducts(); 
  }

  public changeSorting(sort){
    this.sort = sort;
  }

  public changeViewType(viewType, viewCol){
    this.viewType = viewType;
    this.viewCol = viewCol;
  }

  public openProductDialog(product){   
    let dialogRef = this.dialog.open(ProductDialogComponent, {
        data: product,
        panelClass: 'product-dialog',
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    });
    dialogRef.afterClosed().subscribe(product => {
      if(product){
        this.router.navigate(['/products', product.id, product.name]); 
      }
    });
  }

  public onPageChanged(event){
    this.page = event;
    this.getAllProducts(); 
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0,0);
    } 
  }

  public onChangeCategory(event){
    if(event.target){
      this.router.navigate(['/products', event.target.innerText.toLowerCase()]); 
    }   
  }
}
