import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../settings/app.settings'
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';


@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http:Http) { }

  getUser(){
    return JSON.parse(this.user);
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post( AppSettings.API_ENDPOINT + 'users/register',user,{headers: headers})
    .map( res => res.json());
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post( AppSettings.API_ENDPOINT + 'users/authenticate',user,{headers: headers})
    .map( res => res.json());
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'users/profile',{headers: headers})
    .map( res => res.json());
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loadUser(){
    const user = localStorage.getItem('user');
    this.user = user;
  }

  loggedIn(){
    return tokenNotExpired('id_token');
  }

  isAdmin(){
    //if(this.user.username)
    let user;
    this.loadUser();
    user = JSON.parse(this.user);

    if(this.loggedIn() && AppSettings.USER_ID === AppSettings.ADMIN_ID){
      return true;
    }else{
      return false;
    }    
  }
  
  storeUserData(token, user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  getNumberUser(){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.get( AppSettings.API_ENDPOINT + 'users/number',{headers: headers})
    .map( res => res.json());
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  addLikedMovie(body){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    
    let id = JSON.parse(this.user).id;
    return this.http.patch( AppSettings.API_ENDPOINT + 'users/edit/addContentProfile/' + id, body ,{headers: headers})
    .map( res => res.json());
  }

  updateProfile(profileUpdated){
    let body = {
      name: profileUpdated.name,
      email: profileUpdated.email,
      birthDate: profileUpdated.birthDate,
      description: profileUpdated.description
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(profileUpdated);
    console.log("rf");
    return this.http.patch( AppSettings.API_ENDPOINT + 'users/edit/updateProfile/' + profileUpdated._id, body ,{headers: headers})
    .map( res => res.json());
    
  }
}
