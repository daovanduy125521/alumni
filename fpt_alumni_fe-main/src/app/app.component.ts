import { IconServiceService } from './services/icon-service.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastServiceService } from './services/toast-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private iconService : IconServiceService){}
  ngOnInit(): void {
    console.log("init icons")
    this.iconService.loadIcons();
  }
  title = 'FPT_Alumni';


}
