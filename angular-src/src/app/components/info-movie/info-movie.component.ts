import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { NotificationService } from '../../services/notification.service';
import { Movie } from '../../models/Movie'

@Component({
  selector: 'app-info-movie',
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.css']
})
export class InfoMovieComponent implements OnInit {
  id: String;
  private sub: any;
  movie: Movie;
  imdbMovie: boolean= false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private movieService: MovieService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id']; 
       
       this.movieService.getMovieById(this.id).subscribe( data =>{
         if(data.movie.imdbId === null || data.movie.imdbId === "" || data.movie.imdbId === undefined){
           this.movie = data.movie;
            console.log(this.movie);
           return true;
         }else{
           let id = data.movie.imdbId;
           this.movieService.getMovieByIMDbId(id).subscribe(movie =>{
            console.log(movie);
            this.movie = movie;
            this.imdbMovie = true;
           });
         }
       });
    });
  }

  getStyleMetascore(metascore){
    if(metascore != null){
      if(metascore === "N/A"){
        return 'no-metascore';
      }
      if(metascore  < 40){
        return 'metascore-red';
      }
      if(metascore <60){
        return 'metascore-orange';
      }
      if(metascore < 75){
        return 'metascore-yellow';
      }
      if(metascore < 90){
        return 'metascore-green';
      }
      if(metascore <= 100){
        return 'metascore-greener';
      }
    }
  }
  

}
