import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { AddCategoryComponent } from './add-category/add-category.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router,ActivatedRoute } from '@angular/router';
import { CategoryService } from './category.service'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  public categories:Category[] = []; 
  public page: any;
  public count = 6;
  public settings:Settings;
  constructor(public router:Router, public activatedRoute:ActivatedRoute, public dialog: MatDialog, public appSettings:AppSettings,private categoryService:CategoryService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.getCategories();
  }

  public getCategories(){   
    this.categoryService.getCategoryList().subscribe(data => {
      this.categories = data; 
    }); 
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openCategoryDialog(data:any) {
    this.router.navigate(['add-category'],{relativeTo:this.activatedRoute}); 
    // this.router.navigate(['add-category'],{relativeTo:this.activatedRoute}); 
    // const dialogRef = this.dialog.open(AddCategoryComponent, {
    //   data: {
    //     category: data,
    //     categories: this.categories
    //   },
    //   panelClass: ['theme-dialog'],
    //   autoFocus: false,
    //   direction: (this.settings.rtl) ? 'rtl' : 'ltr'
    // });
    // dialogRef.afterClosed().subscribe(category => { 
    //   if(category){    
    //     const index: number = this.categories.findIndex(x => x.id == category.id);
    //     if(index !== -1){
    //       this.categories[index] = category;
    //     } 
    //     else{ 
    //       let last_category = this.categories[this.categories.length - 1]; 
    //       category.id = last_category.id + 1;
    //       this.categories.push(category);  
    //     }          
    //   }
    // });
  }

  public remove(category:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this category?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.categories.indexOf(category);
        if (index !== -1) {
          this.categoryService.deleteCategory(category.categoryId).subscribe({
            next:(res) => {
              console.log(res);
            },
            error:(e) =>{
              console.log(e);
            }
        })
          this.categories.splice(index, 1);  
        } 
      } 
    }); 
  }
}
