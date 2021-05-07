import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PipeProperty } from './model';

export class DialogData {
  propValueList: PipeProperty[] = [];
}

@Component({
  selector: 'edit-dlg',
  templateUrl: 'edit-dlg.html',
  styleUrls: ['edit-dlg.css']
})
export class EditDialog {
  constructor(
    public dialogRef: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
