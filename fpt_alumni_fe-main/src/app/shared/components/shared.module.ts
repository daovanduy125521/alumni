import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';




@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,

  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,

  ],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
  ]
})
export class SharedModule { }
