import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from 'src/app/shared/services/userservice'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { AccountService } from "src/app/shared/services/account.service";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})

export class UpdatePasswordComponent implements OnInit {
  public form: UntypedFormGroup;
  public userId: number = 0;
  public errorMessage: string = '';
  private sub: any;
  roles: any[];
  public url: any = null;
  selectedfile: any;

  constructor(
    public router: Router,
    public fb: UntypedFormBuilder,
    private userService: UserService,
    public snackBar: MatSnackBar,
    private messageService: MessageService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    let currentUser = this.accountService.getUserInfo();
    this.userId = currentUser.userId;
    this.getUserById();
  }

  ngOnDestroy() {
    //this.sub.unsubscribe();
  }

  initializeForm() {
    this.form = this.fb.group({
      userId: 0,
      userName: [null, Validators.required],
      displayName: [null, Validators.required],
      email: [null, Validators.required],
      phone: [null, Validators.required],
      password: [null, Validators.required],
      address: [null],
      dob: [null, Validators.required],
      locality: [null, Validators.required],
    });
  }

  public getUserById() {
    this.userService.getUser(this.userId).subscribe((res: any) => {
      this.form.patchValue(res.data);
      this.url = environment.apiUrl + '/' + res.data?.image
    });
  }

  public onSubmit() {
    const formData = new FormData();
    formData.append("ImageFile", this.selectedfile);
    if (this.form.valid) {
      this.userService.updateUserProfile(this.form.value).subscribe({
        next: (res: Response) => {
          if (res.status) {
            if (this.selectedfile) {
              formData.append("userId", this.userId.toString());
              this.userService.addUserImage(formData).subscribe({
                next: (res: Response) => {
                  if (!res.status) {
                    this.messageService.showError(res.data);
                  }
                }
              });
            }
            this.messageService.showSuccess("Profile updated successfully");
          } else {
            this.messageService.showError(res.data);
          }
        },
        error: (e) => {
          console.log(e);
          this.messageService.showError("Unable to update User profile");
        },
      });

    }
  }

  public goToUserList() {
    this.router.navigate(["/user"]);
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

}
