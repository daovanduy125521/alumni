import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthServiceService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.css']
})
export class UserLayoutComponent {
  constructor(private authService : AuthServiceService, private router : Router){}
logout() {
  this.authService.logout().subscribe({
    next: data => {this.router.navigate(['/login'])}
  })
}

}
