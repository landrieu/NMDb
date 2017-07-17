import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { AgmCoreModule } from '@agm/core';
import { AppSettings } from './settings/app.settings'
import { DatePickerModule } from 'ng2-datepicker';
import { FirstUpperCasePipe } from './pipes/firstuppercase.pipe';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostMovieComponent } from './components/post-movie/post-movie.component';

import { FlashMessagesModule } from 'angular2-flash-messages';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { MovieService } from './services/movie.service';
import { LocationService } from './services/location.service';
import { NotificationService } from './services/notification.service';
import { ShowMoviesComponent } from './components/show-movies/show-movies.component';
import { BioComponent } from './components/profile/bio/bio.component';
import { LikeComponent } from './components/profile/like/like.component';
import { RatingComponent } from './components/profile/rating/rating.component';
import { PlacesComponent } from './components/profile/places/places.component';
import { InfoMovieComponent } from './components/info-movie/info-movie.component';


const appRoutes: Routes = [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'post-movie', component: PostMovieComponent, canActivate:[AdminGuard]},
  {path: 'show-movies', component: ShowMoviesComponent, canActivate:[AuthGuard]},
  {path: 'info-movie/:id', component: InfoMovieComponent, canActivate:[AuthGuard]},
  {path:'**', component: HomeComponent}
] 

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    PostMovieComponent,
    ShowMoviesComponent,
    FirstUpperCasePipe,
    BioComponent,
    LikeComponent,
    RatingComponent,
    PlacesComponent,
    InfoMovieComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DatePickerModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    AgmCoreModule.forRoot({
      apiKey: AppSettings.GOOGLE_MAP_KEY
    })
  ],
  providers: [ValidateService, AuthService, MovieService, LocationService, NotificationService, AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
 