import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

}
