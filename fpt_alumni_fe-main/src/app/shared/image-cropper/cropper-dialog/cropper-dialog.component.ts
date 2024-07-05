import { Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';

export type CropperDialogData = {
  image: File;
  width : number;
  height : number;
  }

  export type CopprtDialogResult ={
    blob : Blob;
    imageUrl: string;
  }
@Component({
  selector: 'app-cropper-dialog',
  templateUrl: './cropper-dialog.component.html',
  styleUrls: ['./cropper-dialog.component.css']
})
export class CropperDialogComponent implements OnInit{
resultImage : any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: CropperDialogData, public dialogRef : MatDialogRef<CropperDialogComponent>){
    console.log("data received: ", data)
  }

imageCropped(event: ImageCroppedEvent) {
  this.resultImage = event;
  console.log(event)
}
   max: number = 2;
   min: number = 1;
   zoom: number = 0;
   transform: ImageTransform = {};

   ngOnInit() {}

   onSliderChange( event : Event) {
    let value = (event.target as any).value;
    console.log(value)
     this.zoom = value;
     const scale = value >= 0 ? value  : 0
     console.log(scale)
     this.transform = { scale };
   }

   onClose() {
     this.dialogRef.close();
   }

   onAccept() {
     this.dialogRef.close(this.resultImage);
   }
}
