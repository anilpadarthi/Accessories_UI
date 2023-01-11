import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  public reviews = [
    { id: 1, statusId: 1, image: 'assets/images/profile/michael.jpg', author: 'Michael Blair', comment: 'lorem ipsum', ratingsCount: 4, ratingsValue: 350, storeId: 1, date: new Date(2020,1,15,14,30) },
    { id: 2, statusId: 2, image: 'assets/images/profile/tereza.jpg', author: 'Tereza Stiles', comment: 'lorem ipsum', ratingsCount: 3, ratingsValue: 290, storeId: 2, date: new Date(2020,2,5,22,20) },
    { id: 3, statusId: 2, image: 'assets/images/profile/adam.jpg', author: 'Adam Sandler', comment: 'lorem ipsum', ratingsCount: 5, ratingsValue: 450, storeId: 1, date: new Date(2020,3,29,13,15) },
    { id: 4, statusId: 1, image: 'assets/images/profile/julia.jpg', author: 'Julia Aniston', comment: 'lorem ipsum', ratingsCount: 4, ratingsValue: 350, storeId: 2, date: new Date(2020,4,12,11,50) },
    { id: 5, statusId: 2, image: 'assets/images/profile/bruno.jpg', author: 'Bruno Vespa', comment: 'lorem ipsum', ratingsCount: 3, ratingsValue: 300, storeId: 2, date: new Date(2020,5,5,16,25) },
    { id: 6, statusId: 1, image: 'assets/images/profile/ashley.jpg', author: 'Ashley Ahlberg', comment: 'lorem ipsum', ratingsCount: 5, ratingsValue: 300, storeId: 1, date: new Date(2020,6,18,12,30) },
    { id: 7, statusId: 1, image: 'assets/images/avatars/avatar-5.png', author: 'Michelle Ormond', comment: 'lorem ipsum', ratingsCount: 4, ratingsValue: 300, storeId: 1, date: new Date(2020,6,28,17,23) }
  ];
  public statuses = [ 
    { id: 1, name: 'Approved' },
    { id: 2, name: 'Pending' }
  ];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ];
  public page: any;
  public count = 6;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public unApprove(review:any){ 
    const index: number = this.reviews.findIndex(x => x.id == review.id);
    if(index !== -1){
      review.statusId = 2;
      this.reviews[index] = review;
    } 
  }

  public remove(review:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this review?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.reviews.indexOf(review);
        if (index !== -1) {
          this.reviews.splice(index, 1);  
        } 
      } 
    }); 
  }


}
