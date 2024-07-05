import { IconServiceService } from './../../../services/icon-service.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Toast } from 'src/app/model/toast';
import { ToastServiceService } from 'src/app/services/toast-service.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit{

  toasts: Toast[] = [];
  svgContent: string = '';

  constructor(private toastService: ToastServiceService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {

    this.toastService.toastState.subscribe((toast: Toast) => {
      console.log(this.toasts)
      this.toasts.push(toast);
      this.cdr.detectChanges();
      setTimeout(() => this.removeToast(toast), toast.duration + 1000);
    });
  }

  removeToast(toast: Toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

}
