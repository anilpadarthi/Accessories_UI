import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    this.form = this.fb.group({
      'categoryId': 0,
      'categoryName': [null, Validators.required],
      'images': null
    });

    this.sub = this.activatedRoute.params.subscribe(params => {
      if (this.data.id) {
        this.categoryId = parseInt(this.data.id);
        this.getCategoryById();
      }
    });
  }

  public getCategoryById() {
    this.categoryService.getCategory(this.categoryId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  public onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      if (this.categoryId === 0) {
        this.categoryService.addCategory(this.form.value).subscribe({
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
            this.errorMessage = 'Unable to create Category';
          }
        })
      }
      else {
        this.categoryService.updateCategory(this.form.value).subscribe({
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
