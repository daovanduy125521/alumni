import { ResetPasswordComponent } from './pages/login/reset-password/reset-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './shared/layouts/main/main.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './pages/login/forgot-password/forgot-password.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { RegisterComponent } from './pages/login/register/register.component';
import { RoleGuard } from './core/guard/auth.guard';
import { ImportUserComponent } from './pages/user-management/import-user/import-user.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserLayoutComponent } from './shared/layouts/user-layout/user-layout.component';
import { StaffManagementComponent } from './pages/staff-management/staff-management.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AccountSettingComponent } from './pages/account-setting/account-setting.component';
import { ApprovalAlumniComponent } from './pages/approval-alumni/approval-alumni.component';
import { TestComponent } from './pages/test/test.component';
import { Role } from './services/const/const';
import { HomeComponent } from './pages/home/home.component';
import { AlumniGroupComponent } from './pages/alumni/alumni-group/alumni-group.component';
import { MenteeFormComponent } from './pages/mentee-form/mentee-form.component';
import { MentorsListComponent } from './pages/mentors-list/mentors-list.component';
import { MentorProfileComponent } from './pages/mentor-profile/mentor-profile.component';
import { MentorFormComponent } from './pages/mentor-form/mentor-form.component';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path:"login", component: LoginComponent,
  },
  {
    path:"test", component: TestComponent,
  },
  {
    path: "forgot", component: ForgotPasswordComponent,// canActivate : [RoleGuard], data: { roles: [Role.ALUMNI] }
  },
  {
    path: "register", component: RegisterComponent
  },
  {
    path: "not_found", component: NotFoundComponent
  },
  { path: "reset_password", component: ResetPasswordComponent},
  //user layout
  {
    path:"", component: UserLayoutComponent,
    children: [  {
    path: "profile", component: UserProfileComponent
  },  {
    path: "setting", component: AccountSettingComponent
  },
  {
    path: "home", component: HomeComponent
  },
  {
    path: "post", component: HomeComponent
  },
  {
    path: "group", component: AlumniGroupComponent
  },
  {
    path: "mentee_form", component: MenteeFormComponent
  },
  {
    path: "mentor_form", component: MentorFormComponent
  },
  {
    path: "mentors_list", component: MentorsListComponent
  },
  {
    path: "mentor_profile/:id", component: MentorProfileComponent
  }
]
  },
  //admin layout
  {
  path: "", component: MainComponent,
  children: [{
    path: "dashboard",
    component: DashboardComponent
  },
  {
    path: "user_management", component: UserManagementComponent
  },
  {
    path: "staff_management", component: StaffManagementComponent
  },
  {
    path: "user_management/import", component: ImportUserComponent
  },
  {
    path: "user_management/approval", component: ApprovalAlumniComponent
  },


]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
