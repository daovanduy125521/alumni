import { V } from '@angular/cdk/keycodes';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastServiceService } from 'src/app/services/toast-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-import-user',
  templateUrl: './import-user.component.html',
  styleUrls: ['./import-user.component.css']
})
export class ImportUserComponent {
// Format the date as mm dd yyyy

  isHovered: boolean = false;
  isFileValid: boolean = true;
  fileError: string = '';
  selectedFile: File | null = null;
  importSuccessQuantity : number = 0
  importFailedQuantity : number = 0
  validKey : string = "";
  invalidKey: string = "";

  constructor(private toastService : ToastServiceService, private userService : UserServiceService) { }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isHovered = false;

    const files = event.dataTransfer?.files;
    if (files && files.length ==1) {
      this.validateAndSetFile(files[0]);
    }else{
      this.toastService.showToast({   //show notification
        title: 'Exceed limit',
        message: "You can only import 1 file",
        type: 'error',
        duration: 5000,
      });
    }

  }

  validateAndSetFile(file: File) {
    const maxSize = 30 * 1024 * 1024; // 30 MB

    if (!this.isExcelFile(file)) {
      this.isFileValid = false;
      this.fileError = 'Invalid file type. Please upload an Excel file.';
        this.toastService.showToast({   //show notification
          title: 'Error upload file',
          message: this.fileError,
          type: 'error',
          duration: 5000,
        });
    }

    else if (file.size > maxSize) {
      this.isFileValid = false;
      this.fileError = 'File size exceeds 30 MB.';
      this.toastService.showToast({   //show notification
        title: 'File size exceeds',
        message: this.fileError,
        type: 'error',
        duration: 5000,
      });
    } else {
      this.isFileValid = true;
      this.fileError = '';
      this.selectedFile = file;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isHovered = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isHovered = false;
  }

  openFileInput() {
    document.getElementById('fileInput')!.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length == 1) {
      this.validateAndSetFile(input.files[0])
    }else{
      this.toastService.showToast({   //show notification
        title: 'Exceed limit',
        message: "You can only import 1 file",
        type: 'error',
        duration: 5000,
      });
    }
    // const files = event.dataTransfer!.files;

  }

  importUser() {
    if (this.selectedFile && this.isFileValid) {
      console.log(this.selectedFile)
      this.userService.importExcel(this.selectedFile).subscribe({
        next: (data: any)=>{console.log(data)
          this.invalidKey= data.data.invalidKey;
          this.importSuccessQuantity = data.data.successAlumniImported;
          this.importFailedQuantity = data.data.failedNumber;
          console.log(data)
        },
        error: err =>{console.log("Error: "+err)}
      })

    }else{
      this.toastService.showToast({   //show notification
        title: 'Invalid file',
        message: "Please choose an excel file",
        type: 'error',
        duration: 5000,
      });
    }
  }

  isExcelFile(file: File): boolean {

    const acceptedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    return acceptedTypes.includes(file.type);
  }

  convertToNormalDateFormat(dateString: string): string {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Invalid Date";
    }

    const dateParts = dateString.split('T')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    // Format the date as mm dd yyyy
    const normalDateFormat = `${month}-${day}-${year}`;

    return normalDateFormat;
  }
  exportInvalidUser() {
    this.userService.exportErrorUser(this.invalidKey).subscribe({
      next: (blob: any) =>{
        console.log(blob)
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = 'downloadedFile.xlsx'; // You can set the file name here
        a.click();
        URL.revokeObjectURL(objectUrl);
      }
    })

  }
}
