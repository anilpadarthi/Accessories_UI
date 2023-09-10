import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { AreaService } from 'src/app/shared/services/areaservice'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';

@Component({
  selector: 'app-create-area',
  templateUrl: './create-area.component.html',
  styleUrls: ['./create-area.component.scss']
})

export class CreateAreaComponent implements OnInit {
  public form: UntypedFormGroup;
  public areaId: number = 0;
  public errorMessage: string = '';
  private sub: any;

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private areaService: AreaService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.areaId = parseInt(params["id"]);
        this.getAreaById();
      }
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      areaId: 0,
      areaName: [null, Validators.required],
    });
  }

  public getAreaById() {
    this.areaService.getArea(this.areaId).subscribe((res: any) => {
      this.form.patchValue({
        areaId: res.data.areaId,
        areaName: res.data.areaName,
      });
    });
  }

  public onSubmit() {
    this.errorMessage = '';
    if (this.form.valid) {
      if (this.areaId === 0) {
        this.areaService.createArea(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.messageService.showSuccess(res.data);
              this.backToAreaList();
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to create Area';
          }
        })
      }
      else {
        this.areaService.updateArea(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              this.messageService.showSuccess(res.data);
              this.backToAreaList();
            }
            else {
              this.errorMessage = res.data;
            }
          },
          error: (e) => {
            console.log(e);
            this.errorMessage = 'Unable to update Area';
          }
        })
      }
    }
  }

  backToAreaList() {
    this.router.navigate(["/area"]);
  }


  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

}

