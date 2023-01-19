import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { CategoryService } from '../category.service'
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public categoryId:number=0;

  constructor(public router:Router,public fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private categoryService:CategoryService,public snackBar: MatSnackBar) { }

  ngOnInit(): void { 
    this.form = this.fb.group({
      'categoryId':0,
      'categoryName': [null, Validators.required],
      'images':null
    }); 
    this.sub = this.activatedRoute.params.subscribe(params => {  
      if(params['id']){
        this.categoryId = parseInt(params['id']);
        // this.form.patchValue(this.categoryId);
        this.getCategoryById(); 
      }  
    }); 
  }

  public getCategoryById(){
    this.categoryService.getCategory(this.categoryId).subscribe((data:any)=>{ 
      this.form.patchValue(data); 
    });
  }
   
  public navigateToCateogryList()
  {
    this.router.navigate(['/admin/categories']); 
  }
  public onSubmit(){
    console.log(this.form.value);
    if(this.form.valid){
      if(this.categoryId === 0){
      this.categoryService.addCategory(this.form.value).subscribe({
        next:(res) => {
      this.snackBar.open(res.toString(), '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        },
        error:(e) =>{
          console.log(e);
          this.snackBar.open('Unable to update Category', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
    })
    }
    else{
      this.categoryService.updateCategory(this.form.value).subscribe({
        next:(res) => {
          this.snackBar.open(res.toString(), '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        },
        error:(e) =>{
          console.log(e);
          this.snackBar.open('Unable to update Category', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
    })
    }
  }
}
  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

}
