import { Component, OnInit, Inject } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { SubCategoryService } from "../../../../shared/services/subCategory.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Response } from "src/app/shared/models/response";
import { MessageService } from "src/app/shared/services/message.service";
import { LookupService } from "src/app/shared/services/lookup.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-add-sub-category",
  templateUrl: "./add-sub-category.component.html",
  styleUrls: ["./add-sub-category.component.scss"],
})
export class AddSubCategoryComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  subCategoryId: number = 0;
  categories: any[];
  errorMessage: string = "";

  constructor(
    public dialogRef: MatDialogRef<AddSubCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private subCategoryService: SubCategoryService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      categoryId: null,
      subCategoryId: 0,
      subCategoryName: [null, Validators.required],
      images: null,
    });

    this.sub = this.activatedRoute.params.subscribe((params) => {
      debugger;
      if (this.data.id) {
        this.subCategoryId = parseInt(this.data.id);
        this.loadData();
      } else if (this.data.categoryId) {
        this.form.patchValue({ categoryId: this.data.categoryId });
      }
    });
    this.getCategoryLookup();
  }

  public loadData() {
    this.subCategoryService
      .getSubCategory(this.subCategoryId)
      .subscribe((res: any) => {
        this.form.patchValue(res.data);
      });
  }

  getCategoryLookup() {
    this.lookupService.getCategories().subscribe((res) => {
      this.categories = res.data;
    });
  }

  public navigateToCateogryList() {
    this.router.navigate(["/sub-category"]);
  }

  public onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      if (this.subCategoryId === 0) {
        this.subCategoryService.addSubCategory(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            } else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError("Unable to create Category");
          },
        });
      } else {
        this.subCategoryService.updateSubCategory(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.dialogRef.close(this.form.value);
              this.messageService.showSuccess(res.data);
            } else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError("Unable to update Category");
          },
        });
      }
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
