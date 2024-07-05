import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmailValidateDirective } from './shared/directive/email-validate.directive';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { MatDialogModule } from "@angular/material/dialog";
import { AddUserDialogComponent } from './pages/user-management/add-user-dialog/add-user-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptorInterceptor } from "./core/auth-interceptor.interceptor";
import { RegisterComponent } from './pages/login/register/register.component';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import { CookieService } from 'ngx-cookie-service'
import { MatIconModule } from '@angular/material/icon';
import { EditUserDialogComponent } from './pages/user-management/edit-user-dialog/edit-user-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastComponent } from "./shared/components/toast/toast.component";
import { ImportUserComponent } from "./pages/user-management/import-user/import-user.component";
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { StaffManagementComponent } from './pages/staff-management/staff-management.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ResetPasswordComponent } from './pages/login/reset-password/reset-password.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AccountSettingComponent } from './pages/account-setting/account-setting.component';
import {MatChipsModule} from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { ApprovalAlumniComponent } from './pages/approval-alumni/approval-alumni.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.development';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { TestComponent } from './pages/test/test.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageControlComponent } from './shared/image-cropper/image-control/image-control.component';
import { CropperDialogComponent } from './shared/image-cropper/cropper-dialog/cropper-dialog.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CreateStaffDialogComponent } from './pages/staff-management/create-staff-dialog/create-staff-dialog.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { HomeComponent } from './pages/home/home.component';
import { LoadingService } from './services/loading.service';
import { CreatePostDialogComponent } from './pages/user-profile/create-post-dialog/create-post-dialog.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {MatExpansionModule} from '@angular/material/expansion';
import { MainModule } from './shared/layouts/main/main.module';
import { PostComponent } from './shared/components/post/post.component';
import { ImageModelComponent } from './shared/components/image-model/image-model.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { AlumniGroupComponent } from './pages/alumni/alumni-group/alumni-group.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MenteeFormComponent } from './pages/mentee-form/mentee-form.component';
import { MentorsListComponent } from './pages/mentors-list/mentors-list.component';
import { MentorProfileComponent } from './pages/mentor-profile/mentor-profile.component';

registerLocaleData(vi);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailValidateDirective,
    UserManagementComponent,
    ForgotPasswordComponent,
    AddUserDialogComponent,
    RegisterComponent,
    EditUserDialogComponent,
    ToastComponent,
    ImportUserComponent,
    UserProfileComponent,
    StaffManagementComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NotFoundComponent,
    AccountSettingComponent,
    ApprovalAlumniComponent,
    TestComponent,
    CropperDialogComponent,
    ImageControlComponent,
    CreateStaffDialogComponent,
    SpinnerComponent,
    HomeComponent,
    CreatePostDialogComponent,
    PostComponent,
    ImageModelComponent,
    AlumniGroupComponent,
    MenteeFormComponent,
    MentorsListComponent,
    MentorProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatBadgeModule,
    MatIconModule,
    NgSelectModule,
    ReactiveFormsModule,
    MatTabsModule,
    NzTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    NzBadgeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    ImageCropperModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    CKEditorModule,
    MatExpansionModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule

],
  providers: [
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorInterceptor,
      multi: true,
    },
    CookieService,
    { provide: NZ_I18N, useValue: vi_VN },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
