import { Component } from '@angular/core';
import { ImageCloudService } from 'src/app/services/image-cloud.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  uploadPercent: number | undefined;
  downloadURL: string | undefined;
  filePath = "";
  constructor(private imageService: ImageCloudService) {}

  upload(event: any) {
    const file = event.target.files[0];
     this.filePath = `images/${file.name}`;
    this.imageService.uploadImage(file, this.filePath).subscribe(url => {
      this.downloadURL = url;
    });
  }

  delete() {
    this.imageService.deleteImage(this.filePath).subscribe(() => {
      this.downloadURL = undefined;
    });}
}
