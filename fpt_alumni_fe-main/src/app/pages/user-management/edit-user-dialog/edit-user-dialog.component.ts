import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/model/item';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit{
  roles : Item[];
  userForm! : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb : FormBuilder
  ) {
    this.userForm = fb.group({
      email : [""],
      roleId : [""]
    })

    this.roles = data.listRole;
    this.roles[0].title
    console.log(this.roles[0].title);
  }
  ngOnInit(): void {
    this.userForm = this.fb.group({
      Id: [''],
      Email: [''],
      Password: ['', Validators.required],
      Status: ['', Validators.required],
      RoleId: ['', Validators.required]
    });

    this.roles[0].title
    console.log(this.roles[0].title);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    if(this.userForm.valid){
       console.log(this.userForm.value)
    // You can add validation logic here if needed
    this.dialogRef.close(this.userForm.value);
    }

  }


}
