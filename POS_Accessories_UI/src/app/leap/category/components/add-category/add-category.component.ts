import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})

export class AddCategoryComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public categoryId: number = 0;

  constructor(public router: Router, public fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private categoryService: CategoryService, public snackBar: MatSnackBar, private messageService: MessageService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'categoryId': 0,
      'categoryName': [null, Validators.required],
      'images': null
    });

    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.categoryId = parseInt(params['id']);
        this.getCategoryById();
      }
    });
  }

  public getCategoryById() {
    this.categoryService.getCategory(this.categoryId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  public navigateToCateogryList() {
    this.router.navigate(['/category']);
  }
  public onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      if (this.categoryId === 0) {
        this.categoryService.addCategory(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.navigateToCateogryList();
              this.messageService.showSuccess(res.data);
            }
            else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError('Unable to create Category');
          }
        })
      }
      else {
        this.categoryService.updateCategory(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              debugger;
              this.navigateToCateogryList();
              this.messageService.showSuccess(res.message);
            }
            else {
              this.messageService.showError(res.message);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError('Unable to update Category');
          }
        })
      }

    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
