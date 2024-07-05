import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-model',
  templateUrl: './image-model.component.html',
  styleUrls: ['./image-model.component.css']
})
export class ImageModelComponent {
  currentIndex: number;
  isLoading: boolean = true;
  scale: number = 1;
  imageLoadFailed: boolean = false;
  constructor(public dialogRef: MatDialogRef<ImageModelComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentIndex = data.index;
  }

  nextImage(): void{
    if (this.currentIndex < this.data.images.length - 1) {
      this.imageLoadFailed = false;
      this.isLoading = true;
      this.currentIndex++;
      this.resetZoom();
    }
  }

  prevImage(): void{
    if (this.currentIndex > 0) {
      this.imageLoadFailed = false;
      this.isLoading = true;
      this.currentIndex--;
      this.resetZoom();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  onImageLoad(): void{
    this.isLoading = false;
  }

  onImageError(): void {
    this.isLoading = false;
    this.imageLoadFailed = true;
  }

  zoomIn(): void {
    if(this.scale <= 1.6){
      this.scale += 0.2;
    }

  }

  zoomOut(): void {
    if (this.scale > 0.6) {
      this.scale -= 0.2;
    }
  }

  resetZoom(): void {
    this.scale = 1;
  }




}
