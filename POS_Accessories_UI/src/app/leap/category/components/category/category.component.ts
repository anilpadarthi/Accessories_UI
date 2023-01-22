import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/models/category.models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Router,ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service'

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
    this.router.navigate(['create'],{relativeTo:this.activatedRoute}); 
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
