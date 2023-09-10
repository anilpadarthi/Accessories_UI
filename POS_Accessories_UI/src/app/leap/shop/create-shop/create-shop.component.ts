import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { ShopService } from 'src/app/shared/services/shopservice'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-create-shop',
  templateUrl: './create-shop.component.html',
  styleUrls: ['./create-shop.component.scss']
})


export class CreateShopComponent implements OnInit {
  public form: UntypedFormGroup;
  public shopId: number = 0;
  public errorMessage: string = '';
  private sub: any;

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private shopService: ShopService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.shopId = parseInt(params["id"]);
        this.getShopById();
      }
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      areaId: 0,
      areaName: [null, Validators.required],
    });
  }

  public getShopById() {
    this.shopService.getShop(this.shopId).subscribe((res: any) => {
      this.form.patchValue({
        areaId: res.data.areaId,
        areaName: res.data.areaName,
      });
    });
  }

  public onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      if (this.shopId === 0) {
        this.shopService.createShop(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.messageService.showSuccess(res.data);
              this.backToShopList();
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to create Shop';
          }
        })
      }
      else {
        this.shopService.updateShop(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.messageService.showSuccess(res.data);
              this.backToShopList();
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to update Shop';
          }
        })
      }
    }
  }

  backToShopList() {
    this.router.navigate(["/shop"]);
  }


  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

}



