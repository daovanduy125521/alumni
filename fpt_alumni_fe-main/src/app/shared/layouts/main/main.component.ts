import { LocalStorageService } from './../../../services/local-storage.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/services/user-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit{
  userName: string = "Unknonw";
  selectedButton: string ='';
  @ViewChild('sidenav', {static: true}) public sidenav!: MatSidenav;
  constructor(private observer: BreakpointObserver, private router: Router, private userService: UserServiceService,private authService : AuthServiceService
    , private localStorageService : LocalStorageService
  ) {

  }
  ngOnInit() {
    const currentUser = this.localStorageService.getItem("Full_Name")
    if(currentUser){
          this.userName = currentUser;
    }
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }
  selectButton(buttonName: string) {
    this.router.navigate(["admin/user_management"])
    switch (buttonName) {
      case 'Dashboard':
        this.router.navigate(["admin/dashboard"])
        break;
      case 'Alumni':
        this.router.navigate(["user_management"])
        break;
      case 'Staff':
        this.router.navigate(["staff_management"])
        break;
      default:

        break;
    }
    this.selectedButton = buttonName;
  }
  logout() {
    this.authService.logout().subscribe({
      next: data => {this.router.navigate(['/login'])}
    })
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
