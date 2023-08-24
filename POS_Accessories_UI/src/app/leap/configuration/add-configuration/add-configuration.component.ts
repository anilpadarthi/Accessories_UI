import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfigurationService } from 'src/app/shared/services/configuration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { LookupService } from 'src/app/shared/services/lookup.service';

@Component({
  selector: 'app-add-configuration',
  templateUrl: './add-configuration.component.html',
  styleUrls: ['./add-configuration.component.scss']
})

export class AddConfigurationComponent implements OnInit {
  public form: UntypedFormGroup;
  private sub: any;
  configurationId: number = 0;
  configurationTypes: any[];

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private configurationService: ConfigurationService,
    public snackBar: MatSnackBar,
    private lookupService: LookupService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      'configurationId': 0,
      'configurationTypeId': 0,
      'amount': [0, Validators.required],
      'fromDate': [null, Validators.required],
      'toDate': null
    });

    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params['id']) {
        this.configurationId = parseInt(params['id']);
        this.loadData();
      }
    });
    this.getConfigurationTypesLookup();
  }

  public loadData() {
    this.configurationService.getById(this.configurationId).subscribe((res: any) => {
      this.form.patchValue(res.data);
    });
  }

  getConfigurationTypesLookup() {
    this.lookupService.getConfigurationTypes().subscribe(res => {
      this.configurationTypes = res.data;
    });
  }

  public navigateToListPage() {
    this.router.navigate(['/configuration']);
  }


  public onSubmit() {

    var requestBody = {
      ConfigurationId: this.form.value.configurationId,
      ConfigurationTypeId: this.form.value.configurationTypeId,
      Amount: this.form.value.amount,
      FromDate: this.form.value.fromDate,
      ToDate: this.form.value.toDate
    };
    
    if (this.form.valid) {
      if (this.configurationId === 0) {
        this.configurationService.create(requestBody).subscribe({
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
            this.messageService.showError('Unable to create Configuration');
          }
        })
      }
      else {
        this.configurationService.update(requestBody).subscribe({
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
            this.messageService.showError('Unable to update Configuration');
          }
        })
      }

    }
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

