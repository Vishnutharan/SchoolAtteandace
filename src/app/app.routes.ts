import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LoginComponent } from '../components/login/login.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirect to 'home' by default
  // { path: '**', redirectTo: '/home' },  // Redirect any unknown paths to 'home'
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
