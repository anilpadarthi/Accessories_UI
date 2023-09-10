import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from 'src/app/shared/services/userservice'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Response } from 'src/app/shared/models/response';
import { MessageService } from 'src/app/shared/services/message.service';
import { LookupService } from 'src/app/shared/services/lookup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})

export class CreateUserComponent implements OnInit {
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
    private activatedRoute: ActivatedRoute,
    private lookupService: LookupService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getUserRoleLookup();
    this.sub = this.activatedRoute.params.subscribe((params) => {
      if (params["id"]) {
        this.userId = parseInt(params["id"]);
        this.getUserById();
      }
    });
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
      userRoleId: [null, Validators.required],
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

  getUserRoleLookup() {
    this.lookupService.getUserRoles().subscribe(res => {
      this.roles = res.data;
    });
  }
  
  backToUserList() {
    this.router.navigate(["/user"]);
  }

  public onSubmit() {
    const formData = new FormData();
    formData.append("ImageFile", this.selectedfile);
    if (this.form.valid) {
      if (this.userId === 0) {
        this.userService.createUser(this.form.value).subscribe({
          next: (res: Response) => {
            if (res.status) {
              if (this.selectedfile) {
                formData.append("userId", res.data.userId);
                this.userService.addUserImage(formData).subscribe({
                  next: (res: Response) => {
                    if (!res.status) {
                      this.messageService.showError(res.data);
                    }
                  }
                });
              }

              this.goToUserList();
              this.messageService.showSuccess("User created successfully");
            } else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError("Unable to create User");
          },
        });
      } else {
        this.userService.updateUser(this.form.value).subscribe({
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
              this.goToUserList();
              this.messageService.showSuccess("User updated successfully");
            } else {
              this.messageService.showError(res.data);
            }
          },
          error: (e) => {
            console.log(e);
            this.messageService.showError("Unable to update User");
          },
        });
      }
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


