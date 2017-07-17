import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../services/auth.service';
import { LocationService } from '../../services/location.service';
import { NotificationService } from '../../services/notification.service';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { AppSettings } from '../../settings/app.settings';

@Component({
  selector: 'app-post-movie',
  templateUrl: './post-movie.component.html',
  styleUrls: ['./post-movie.component.css']
})
export class PostMovieComponent implements OnInit {
  title: String;
  movie: Movie;
  latitude: number = 0;
  longitude: number = 0;
  displayMap: boolean = false;
  zoom: number = 7;
  date: DateModel;
  options: DatePickerOptions;
  param: DateModel;
  requestTitle: String;
  requestYear: String;
  requestType: String;
  requestMovie: RequestMovie;
  requestMovies: Movie[];
  postFromIMDb: boolean = false;

  constructor(private validateService: ValidateService, private authService: AuthService,
              private flashMessages: FlashMessagesService, private notificationService: NotificationService,
              private movieService: MovieService,
              private locationService: LocationService) {

      this.authService.isAdmin();
      this.options = new DatePickerOptions();
      this.options.maxDate = new Date();
      this.options.minDate = new Date(1900, 0, 1);
      console.log(this.options.minDate);
  }

  ngOnInit() {
    this.movie = new Movie();
    this.requestMovie = new RequestMovie();
  }

  onMovieSubmit(){

    if(!this.validateService.validateMovie(this.movie)){
      this.notificationService.showNotifDanger("Cannot add movie");
     // this.flashMessages.show("no00",{cssClass: 'alert-danger',timeout:3000});
      return false;
    }
    this.postMovie(this.movie);
    /*this.movieService.postMovie(this.movie).subscribe( data => {
      if(data.success){
        this.flashMessages.show(data.msg,{cssClass: 'alert-success',timeout:3000});
        this.emptyMovie(this.movie);
        this.displayMap = false;
      }else{
        this.flashMessages.show(data.msg,{cssClass: 'alert-danger',timeout:3000});
      }
    });*/
  }

  postMovie(movie){
    this.movieService.postMovie(movie).subscribe( data => {
      if(data.success){
        this.notificationService.showNotifSuccess(data.msg);
        //this.flashMessages.show(data.msg,{cssClass: 'alert-success',timeout:3000});
        this.emptyMovie(this.movie);
        this.displayMap = false;
      }else{
        this.notificationService.showNotifDanger(data.msg);
        //this.flashMessages.show(data.msg,{cssClass: 'alert-danger',timeout:3000});
      }
      this.emptyMovie(this.movie);
    });
  }

  checkLocation(event){
    event.preventDefault();

    if(this.movie.location === undefined){
      return false;
    }
   
    this.locationService.getLocation(this.movie.location).subscribe(location =>{
      if(location.results.length != 0){
        this.movie.location = location.results[0].formatted_address;
        this.latitude = location.results[0].geometry.location.lat;
        this.longitude = location.results[0].geometry.location.lng;
        this.displayMap = true;
        this.zoom = 4;
        if(location.results[0].address_components.length >= 3){
          this.zoom = 7;
        }
        if(location.results[0].address_components.length >= 5){
          this.zoom = 12;
        }
        if(location.results[0].address_components.length >= 7){
          this.zoom = 16;
        }
      }else{
        this.notificationService.showNotifWarning("Address not found");
        //this.flashMessages.show("Address not found",{cssClass: 'alert-danger',timeout:3000});
      }
      
    });
  }

  onMovieSearch(){
    /*console.log(this.requestTitle);
    this.movieService.getMovieByIMDbTitle(this.requestTitle).subscribe( movie => {
      console.log(movie);
      this.requestMovie = movie;
      //document.getElementById('section-request-movie').scrollIntoView();
      
    });*/
    this.emptyMovie(this.requestMovies);
    this.movieService.searchMovieIMDb(this.requestMovie.title,this.requestMovie.type,this.requestMovie.year).subscribe( movies => {
      if(movies.Error){
        this.flashMessages.show(movies.Error,{cssClass: 'alert-danger',timeout:3000});
        this.requestMovies = null;
        return false;
      }
      this.requestMovies = movies.Search.slice(0,5);
      document.getElementById('scroll').scrollIntoView();
    });
  }

  postMovieFromIMDb(id){
    this.movieService.getMovieByIMDbIdShort(id).subscribe(movie =>{
      this.copyMovie(movie);
      
      this.postMovie(this.movie);
      
    });
  }

  copyMovie(movie){
    this.movie.title = movie.Title;
    this.movie.director = movie.Director;
    this.movie.actors = movie.Actors;
    this.movie.location = movie.Country;
    this.movie.budget = "Unknown";
    this.movie.releaseDate = movie.Released;
    this.movie.poster = movie.Poster;
    this.movie.plot = movie.Plot;
    this.movie.metascore = movie.Metascore;
    this.movie.imdbId = movie.imdbID;
  }

  emptyMovie(obj){
    for (var key in obj) {
      obj[key] = "";
    }
  }

  changeForm(form){
    this.postFromIMDb = form;
  }

  isEmpty(stuff){
    if(stuff !== null && stuff !== undefined && stuff !== "" && stuff !== "N/A"){
      return true;
    }else{
      return false;
    }
  }

}

 class Movie{
    title: string;
    director: string;
    actors: string;
    location: string;
    releaseDate: Date;
    budget: string;
    poster: string;
    plot : string;
    metascore: string;
    imdbId: string;
}

class RequestMovie{
  title: String;
  year: String;
  type: String;
  movie: Movie[];

  constructor(){
    this.title = "";
    this.year = "";
    this.type = "";
  }
}

/*interface Movie{
    title: string;
    director: string;
    actors: string;
    location: string;
    releaseDate: Date;
    budget: string;
}*/