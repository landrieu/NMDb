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
  movies: Movie[];

  constructor(private locationService: LocationService, private notificationService: NotificationService, private authService: AuthService, private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies().subscribe( data => {
      this.movies = data.movies;
    })
  }

  rate(id, newRate){
    let index;

    for(let i = 0; i < this.movies.length; i++){
      if(this.movies[i]._id === id){
        index = i;
      }
    }

    this.authService.updateFullProfile(this.ratingUser).subscribe(data => {
        if (data.success !== true) {
          this.notificationService.showNotifDanger("User not updated");
        }
      });

    let movie = this.movies[index];
    movie.rating = ((movie.rating * (movie.nbVotes - 1)) + newRate) / (movie.nbVotes);
    

    this.movieService.updateMovie(movie).subscribe(data => {

      });
  }

}
