import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../settings/app.settings'
import 'rxjs/add/operator/map';

@Injectable()
export class MovieService { 

  constructor(private http: Http) { }

  postMovie(movie){
    console.log(movie);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post( AppSettings.API_ENDPOINT + 'movies/postMovie',movie,{headers: headers})
    .map( res => res.json());
  }

  updateMovie(movie){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put( AppSettings.API_ENDPOINT + 'movies/updateMovie/' + movie._id, movie,{headers: headers})
    .map( res => res.json());
  }

  getMovies(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'movies/movies',{headers: headers})
    .map( res => res.json());
  }

  getMovieById(id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'movies/movieById/'+ id ,{headers: headers})
    .map( res => res.json());
  }

  getMovieByIMDbTitle(title){
    let headers = new Headers();
    let endpoint = 'http://www.omdbapi.com/?t=' + title + '&apikey=' + AppSettings.OMDbKey + '&plot=full';
    return this.http.get( endpoint,{headers: headers})
    .map( res => res.json());
  }

  //Deprecated
  getMovieByIMDbId(id){
    let headers = new Headers();
    let endpoint = 'http://www.omdbapi.com/?i=' + id + '&apikey=' + AppSettings.OMDbKey + '&plot=full';
    return this.http.get( endpoint,{headers: headers})
    .map( res => res.json());
  }

  getMovieByIMDbIdShort(id){
    let headers = new Headers();
    let endpoint = 'http://www.omdbapi.com/?i=' + id + '&apikey=' + AppSettings.OMDbKey;
    return this.http.get( endpoint,{headers: headers})
    .map( res => res.json());
  }

  //Deprecated
  searchMovieIMDb(search, type, year){
    let headers = new Headers();
    let endpoint = 'http://www.omdbapi.com/?s=' + search + '&apiKey=' + AppSettings.OMDbKey + '&type=' + type + '&y=' + year;
    return this.http.get(endpoint, {headers: headers})
    .map(res => res.json());
  }

/************OMDb*****************/
  getMovieIMDbByIdBack(id){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'movies/movieFromIMDb/'+ id ,{headers: headers})
    .map( res => res.json());
  }

  searchMovieIMDBack(search, type, year){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'movies/searchFromIMDb?search=' + search + '&year=' + year + '&type=' + type)
    .map( res => res.json());
  }

/************TMDb*****************/

   searchMovieTMDBack(query, year, type){
     query = query.replace(" ","+");
     console.log(query);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'movies/searchFromTMDb?query=' + query + '&year=' + year + '&type=' + type)
    .map( res => res.json());
  }

  getMovieTMDb(id, type){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'movies/movieFromTMDb/'+ id + '?type=' + type,{headers: headers})
    .map( res => res.json());
  }



  deleteMovie(id){
    let headers = new Headers();
    return this.http.delete(AppSettings.API_ENDPOINT + 'movies/deleteMovie/' + id,{headers: headers})
    .map(res => res.json());
  }

  getColorMetascore(metascore) {
    if (metascore != null) {
      if (metascore === "N/A") {
        return 'no-metascore';
      }
      if (metascore < 40) {
        return 'metascore-red';
      }
      if (metascore < 60) {
        return 'metascore-orange';
      }
      if (metascore < 75) {
        return 'metascore-yellow';
      }
      if (metascore < 90) {
        return 'metascore-green';
      }
      if (metascore <= 100) {
        return 'metascore-greener';
      }
    }
  }
}
