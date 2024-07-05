import { Component, Input, OnChanges, OnInit, SimpleChanges, inject ,} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CopprtDialogResult, CropperDialogComponent } from '../cropper-dialog/cropper-dialog.component';
import { filter } from 'rxjs';
import { ImageCloudService } from 'src/app/services/image-cloud.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.css']
})
export class ImageControlComponent implements OnInit, OnChanges{
  croppedImage : CopprtDialogResult | undefined;
  isSpinner = true;
  avatar = ""
  imageWidth: number = 0;
  constructor(private imageService: ImageCloudService, private localStorage : LocalStorageService){}
  @Input() width: number = 0;

  imageHeight: number = 0;
  @Input() height: number = 0;

  @Input() imageUrl: string = "";


  ngOnInit(): void {
    this.updateImageSize();

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    if (changes['width'] || changes['height'] || changes['imageUrl']) {

      this.updateImageSize();
    }
  }

  private updateImageSize(): void {
    this.imageWidth = this.width;
    this.imageHeight = this.height;
    console.log(this.avatar)
    if(this.imageUrl){
      this.avatar = this.imageUrl;
      this.isSpinner = false;
    }else{
      this.avatar = `https://placehold.co/${this.imageWidth}x${this.imageHeight}`
      this.isSpinner = false;
    }
    console.log(this.avatar)
  }

  dialog = inject(MatDialog)

  fileSelected(event : any){
    console.log("intial dialog")
    let file = event.target.files[0]
    if(file){
      const dialogRef = this.dialog.open(CropperDialogComponent,{
        data: {image: file, width: this.imageWidth, height: this.imageHeight},
        width: '500px'
      });
      dialogRef.afterClosed().pipe(filter(result => !! result)).subscribe({
        next: data =>{
          this.avatar = data.objectUrl;
          console.log("outside cropper close")
          this.upload(data)
          file = null;
        }
      })
    }
  }
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = window.atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: 'image/png' });
  }

  upload(event: any) {
   let userId = this.localStorage.getItem("userId")
   if(userId){
        let filePath = `images/avatar/${userId}`;
    this.imageService.uploadImage(event.blob, filePath).subscribe(url => {
      console.log(url)
    });
   }else{

   }
  }
}
