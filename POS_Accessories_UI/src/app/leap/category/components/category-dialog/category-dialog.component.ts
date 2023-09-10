import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})

export class CategoryDialogComponent implements OnInit {

  public form: UntypedFormGroup;
  private sub: any;
  public categoryId: number = 0;
  public errorMessage: string = '';
  public url: any = null;
  selectedfile: any;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    public snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.initializeForm()
    this.sub = this.activatedRoute.params.subscribe(params => {
      if (this.data.id) {
        this.categoryId = parseInt(this.data.id);
        this.getCategoryById();
      }
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      'categoryId': 0,
      'categoryName': [null, Validators.required],
      'displayOrder': 0
    });
  }

  public getCategoryById() {
    this.categoryService.getCategory(this.categoryId).subscribe((res: any) => {
      console.log(res);
      this.form.patchValue(res.data);
      this.url = environment.apiUrl + '/' + res.data?.image
    });
  }

  imageUpload(event: any) {
    var file = event.target.files[0];
    this.selectedfile = file;
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]); // read file as data url
    reader.onload = (event) => { // called once readAsDataURL is completed
      this.url = event.target.result;
    }
  }

  public onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      var formData = new FormData();
      formData.append("ImageFile", this.selectedfile);
      formData.append("CategoryId", this.form.value.categoryId);
      formData.append("CategoryName", this.form.value.categoryName);
      formData.append("DisplayOrder", this.form.value.displayOrder);

      if (this.categoryId === 0) {
        this.categoryService.addCategory(formData).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            this.errorMessage = 'Unable to create Category';
          }
        })
      }
      else {
        this.categoryService.updateCategory(formData).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to update Category';
          }
        })
      }
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
