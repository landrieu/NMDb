import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { AuthService } from '../../../services/auth.service';
import { MovieService } from '../../../services/movie.service';
import { NotificationService } from '../../../services/notification.service';
import { Movie } from '../../../models/movie';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  @Input () ratingUser;
  @Input () isMyProfile;
  movies: Movie[];
  ratings= [];
  formerRate = [];

  constructor(private locationService: LocationService, private notificationService: NotificationService, private authService: AuthService, private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies().subscribe( data => {
      this.movies = data.movies;
    });
    /*this.authService.getProfile().subscribe( data => {
      this.ratings = data.user.ratedMovies;
    })*/
  }

  ngOnChanges(childUser) {
    if(this.ratingUser){
      this.ratings = this.ratingUser.ratedMovies;
      for(let i = 0; i < this.ratingUser.ratedMovies.length; i++){
        this.formerRate.push(this.ratingUser.ratedMovies[i].rate);
      }
    }
  }

  rate(id, newRate){
    let index;
    let idMovie;
    let formerRate;

    for(let i = 0; i < this.movies.length; i++){
      if(this.movies[i]._id === id){
        index = i;
        idMovie =  id;
      }
    }

    for(let i = 0; i < this.ratings.length; i++){
      if(this.ratings[i].id === id){
        console.log(this.ratings[i]);
        formerRate = this.formerRate[i];
      }
    }
    

    let movie = this.movies[index];
    movie.rating = ((movie.rating * movie.nbVotes) - formerRate + newRate) / (movie.nbVotes);

    console.log(this.formerRate);
    console.log(newRate);
    
    

    this.authService.updateFullProfile(this.ratingUser).subscribe(data => {
        if (data.success !== true) {
          this.notificationService.showNotifDanger("User not updated");
        }
      });

    this.movieService.updateMovie(movie).subscribe(data => {

      });
  }

}
