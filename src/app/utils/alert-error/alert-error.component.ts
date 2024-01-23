import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface Message {
  title: string;
  content: string;
}

@Component({
  selector: 'app-alert-error',
  templateUrl: './alert-error.component.html',
  styleUrl: './alert-error.component.css'
})
export class AlertErrorComponent {
  constructor(
    public dialogRef: MatDialogRef<AlertErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Message) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
