import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../shared/services/product.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { LookupService } from 'src/app/shared/services/lookup.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})

export class ProductDetailComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  public productId: number = 0;
  public categories :[];
  public subCategories :[];
  public sizes:[];
  public colours:[]
  constructor(public router: Router, public fb: UntypedFormBuilder, private activatedRoute: ActivatedRoute, private productService: ProductService, public snackBar: MatSnackBar, private messageService: MessageService,private lookupService:LookupService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'productId': 0,
      'productName': [null, Validators.required],
      'productCode': [null, Validators.required],
      'images': null,
      'isNewArrival':false,
      'isBundle':false,
      'isVatEnabled':false,
      'categoryId':null,
      'subCategoryId':null,
      'description': null,
      'specification':null, 
      'colours': [[]],
      'sizes':[[]]
    });

    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.productId = parseInt(params['id']);
        this.getProductById();
      }
    });
    this.getCategories();
    this.getColours();
    this.getSizes();
  }

  getCategories(){
    this.lookupService.getCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

  getSubCategories(categoryId:number){
    this.lookupService.getSubCategories(categoryId).subscribe(res => {
      this.subCategories = res.data;
    });
  }

  getColours(){
    this.lookupService.getColours().subscribe(res => {
      this.colours = res.data;
    });
  }

  getSizes(){
    this.lookupService.getSizes().subscribe(res => {
      this.sizes = res.data;
    });
  }

  public getProductById() {
    this.productService.getProduct(this.productId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  public navigateToCateogryList() {
    this.router.navigate(['/product']);
  }
  public onSubmit() {
    console.log(this.form.value);
    if (this.form.valid) {
      if (this.productId === 0) {
        this.productService.addProduct(this.form.value).subscribe({
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
            this.messageService.showError('Unable to create Product');
          }
        })
      }
      else {
        this.productService.updateProduct(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.navigateToCateogryList();
              this.messageService.showSuccess(res.message);
            }
            else {
              this.messageService.showError(res.message);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError('Unable to update Product');
          }
        })
      }

    }
  }

  public onCategorySelectionChange(event:any){  
    if(event.value){
      this.getSubCategories(event.value);
    } 
  }  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
