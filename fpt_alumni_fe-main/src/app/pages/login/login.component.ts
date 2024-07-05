import { LocalStorageService } from './../../services/local-storage.service';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification} from 'google-one-tap';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'src/app/model/user';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Role } from 'src/app/services/const/const';
import { emailValidator } from 'src/app/shared/directive/email-validate.directive';
import { environment } from 'src/environments/environment.development';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  isShowPassword: boolean = false;
  isLoginfailed : boolean = false;
  constructor(private router: Router, private _ngZone: NgZone, private authService: AuthServiceService, private cookiesService : CookieService, private cdr: ChangeDetectorRef,
    private ngZone: NgZone, private localStorageService : LocalStorageService
  ){
    this.loginForm = new FormGroup({
      emailLogged: new FormControl("", [
        Validators.required,
        Validators.maxLength(50),
        Validators.email
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ])
    })
  }

  ngOnInit(): void {
    this.loadGoogleLibrary();

  }


  private loadGoogleLibrary() {
    // Load the Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeGoogleButton();
    document.head.appendChild(script);
  }

  private initializeGoogleButton() {
    this.ngZone.runOutsideAngular(() => {
      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: environment.clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        // @ts-ignore
        google.accounts.id.renderButton(document.getElementById('loginBtn')!, {
          theme: 'outline',
          size: 'large',
          width: 200,
        });
        // @ts-ignore
        google.accounts.id.prompt((notification: PromptMomentNotification) => {});
        // Run change detection after the button is rendered
        this.ngZone.run(() => {
          this.cdr.detectChanges();
        });
      };
      // Manually trigger the Google Library Load function if the script is already loaded
    });
  }


  handleCredentialResponse(response: CredentialResponse) {
    // Decoding  JWT token...
    console.log(response)

    this.authService.login(response.credential).subscribe({

      next: data => {console.log(data)
        if(data.data.isExisted == false){

          this.ngZone.run(() => {
            this.router.navigate(['register'], { queryParams: data.data });
          });
        }else{
          let user = this.userMapData(data.data.id, data.data.fullName, data.data.roleName)
          if(user){
            this.localStorageService.setItem("Full_Name", user.username)
            this.localStorageService.setItem("Role", user.role)
            console.log(user);
            if(user.role == Role.ALUMNI){
              this.router.navigate(['home'])
            }else if(user.role == Role.STAFF || user.role == Role.ADMIN){
              this.router.navigate(['dashboard'])
            }else{
              this.router.navigate(['login'])
            }
          }

        }
      },
      error: err => {
        console.log(err)}
    })
      let decodedToken: any | null = null;
      try {
        decodedToken = JSON.parse(atob(response?.credential.split('.')[1]));
      } catch (e) {
        console.error('Error while trying to decode token', e);
      }
      console.log('decodedToken', decodedToken);
    }


    get email() {
      return this.loginForm.get('emailLogged')!;
    }

    get password() {
      return this.loginForm.get('password')!;
    }

    public validate(): void {
      if (this.loginForm.invalid) {
        for (const control of Object.keys(this.loginForm.controls)) {
          this.loginForm.controls[control].markAsTouched();
        }
        return;
      }
    }

    submitForm(){
        if(this.loginForm.valid){
          console.log(this.loginForm.value)
          this.authService.loginWithPassword(this.loginForm.value).subscribe({
            next : (data: any) =>{
              console.log(data)
              let user = this.userMapData(data.data.id, data.data.fullName, data.data.roleName)
              if(user){
                this.localStorageService.setItem("Full_Name", user.username)
                this.localStorageService.setItem("Role", user.role)
                console.log(user);
                if(user.role == Role.ALUMNI){
                  this.router.navigate(['home'])
                }else if(user.role == Role.STAFF || user.role == Role.ADMIN){
                  this.router.navigate(['dashboard'])
                }else{
                  this.router.navigate(['login'])
                }
              }
              },
            error: err =>{
              console.log("LoginFailed")
              this.isLoginfailed = true;}
          });

         // this.router.navigate(['/dashboard']);
        }else{
          console.log("error when login!")
        }
    }

    navigateRegister(){
      this.router.navigate(['register'])
    }

    navigateForgotPassword(){
      this.router.navigate(["forgot"])
    }

    userMapData(id: string, fullName: string, role: string) : User | undefined{
      let userRole: Role;
      if(id || fullName ||role){
        switch(role) {
          case 'Alumni':
            userRole = Role.ALUMNI
            break;
          case 'Staff':
            userRole = Role.STAFF
            break;
          case 'Admin':
            userRole = Role.ADMIN
            break;
          default:
            console.error(`Unknown status: ${role}`);
            return undefined;
            break;// or throw an error, or return a default value
        }
        let user : User = {
          id : id,
          username: fullName,
          role : userRole
        }
        return user;

      }else{
        return undefined;
      }
    }

}
