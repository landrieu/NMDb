import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppSettings } from '../settings/app.settings';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocationService {
  

  constructor(private http: Http) { }
  

  getLocation(location){
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json',
    {
      params:{
        address: location,
        key: AppSettings.GOOGLE_MAP_KEY
      }
    })
    .map(res => res.json())
    .catch( err => err);
  }
  addPlace(param){
    let body = {
      title: param.title,
      longitude: param.longitude,
      latitude: param.latitude,
      seen: param.seen,
      address: param.address
    };
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    console.log(body);
    return this.http.patch( AppSettings.API_ENDPOINT + 'users/edit/addPlace/' + param.id, body ,{headers: headers})
    .map( res => res.json());
  }
}
