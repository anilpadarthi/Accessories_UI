import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CouponService } from 'src/app/shared/services/coupon.service'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent implements OnInit {

  public form: UntypedFormGroup;
  private sub: any;
  couponId = 0;

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private couponService: CouponService,
    public snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      'couponId': 0,
      'couponCode': [null, Validators.required],
      'description': [null, Validators.required],
      'validFrom': [null, Validators.required],
      'validTo': [null, Validators.required],
      'images': null
    });

    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.couponId = parseInt(params['id']);
        this.getById();
      }
    });

  }

  getById(): void {
    this.couponService.getById(this.couponId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  navigateToListPage(): void {
    this.router.navigate(['/coupon']);
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.couponId === 0) {
        this.couponService.create(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.navigateToListPage();
              this.messageService.showSuccess(res.data);
            }
            else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError('Unable to create coupon');
          }
        })
      }
      else {
        this.couponService.update(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.navigateToListPage();
              this.messageService.showSuccess(res.data);
            }
            else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError('Unable to update coupon');
          }
        })
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
