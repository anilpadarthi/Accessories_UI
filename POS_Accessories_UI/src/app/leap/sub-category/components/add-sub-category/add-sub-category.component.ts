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
  public url: any = null;
  selectedfile: any;

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
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (this.data.id) {
        this.subCategoryId = parseInt(this.data.id);
        this.loadData();
      } else if (this.data.categoryId) {
        this.form.patchValue({ categoryId: this.data.categoryId });
      }
    });
    this.getCategoryLookup();
  }

  initializeForm() {
    this.form = this.fb.group({     
      subCategoryId: 0,
      subCategoryName: [null, Validators.required],
      categoryId: [null, Validators.required],
      displayOrder: 0      
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

  public loadData() {
    this.subCategoryService.getSubCategory(this.subCategoryId).subscribe((res: any) => {
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
    if (this.form.valid) {
      var formData = new FormData();
      formData.append("ImageFile", this.selectedfile);        
      formData.append("SubCategoryId", this.form.value.subCategoryId);
      formData.append("SubCategoryName", this.form.value.subCategoryName);
      formData.append("DisplayOrder", this.form.value.displayOrder);
      formData.append("CategoryId", this.form.value.categoryId);
      if (this.subCategoryId === 0) {       
        this.subCategoryService.addSubCategory(formData).subscribe({
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
            this.messageService.showError("Unable to create Sub-Category");
          },
        });
      } else {
        this.subCategoryService.updateSubCategory(formData).subscribe({
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
            this.messageService.showError("Unable to update Sub-Category");
          },
        });
      }
    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
