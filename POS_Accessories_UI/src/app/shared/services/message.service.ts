import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(public snackBar: MatSnackBar) { }

  showSuccess(message:string){
    this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });

  }

  showError(message:string){
    this.snackBar.open(message, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
  }
}
