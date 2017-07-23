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
        this.emptyMovie(this.movie);
        this.displayMap = false;
      }else{
        this.notificationService.showNotifDanger(data.msg);
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
   
    this.emptyMovie(this.requestMovies);
    this.movieService.searchMovieTMDBack(this.requestMovie.title,this.requestMovie.year, this.requestMovie.type).subscribe( movies => {
      if(movies.Error){
        this.flashMessages.show(movies.Error,{cssClass: 'alert-danger',timeout:3000});
        this.requestMovies = null;
        return false;
      }
      //this.requestMovies = movies.Search.slice(0,5);
      //document.getElementById('scroll').scrollIntoView();
      this.requestMovies = movies.results.slice(0,10);
      console.log(this.requestMovies);
    });
  }

  postMovieFromIMDb(id){
   
    this.movieService.getMovieTMDb(id, this.requestMovie.type).subscribe(movie =>{
      if(this.requestMovie.type === "movie"){
        this.copyTMDbMovie(movie);
        this.postMovie(this.movie);
      }
       console.log(this.movie);
      
      
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

  copyTMDbMovie(movie){
    this.movie.title = movie.title;
    this.movie.director = "";
    this.movie.actors = "";
    this.movie.location = "";
    this.movie.budget = movie.budget;
    this.movie.releaseDate = movie.release_date;
    this.movie.poster = movie.poster_path;
    this.movie.plot = movie.overview;
    this.movie.metascore = (parseInt(movie.vote_average)*10);
    this.movie.imdbId = movie.imdb_id;
  }

  copyTMDbSerie(movie){
    this.movie.title = movie.name;
    this.movie.director = "";
    this.movie.actors = "";
    this.movie.location = "";
    this.movie.budget = "";
    this.movie.releaseDate = movie.first_air_date;
    this.movie.poster = movie.poster_path;
    this.movie.plot = movie.overview;
    this.movie.metascore = (parseInt(movie.vote_average)*10);
    this.movie.imdbId = "";
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
    metascore: number;
    imdbId: string;
}

class RequestMovie{
  title: String;
  year: String;
  type: String = "movie";
  movie: Movie[];

  constructor(){
    this.title = "";
    this.year = "";
    this.type = "movie";
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