import { LocalStorageService } from './../../../services/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserServiceService } from 'src/app/services/user-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  userName: string  = "Unknown";
  isMenuOpen = false;
  constructor(private router: Router, private userService: UserServiceService, private authService : AuthServiceService, private localStorageService: LocalStorageService){}
  ngOnInit(): void {
    const currentUser = this.localStorageService.getItem("Full_Name")
    if(currentUser){
          this.userName = currentUser;
    }
  }
  logout(){
    this.router.navigate(["login"])
  }

  redirectToHome(){
    this.router.navigate(["/"])
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
