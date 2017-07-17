import { Component, OnInit, Input } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit {
  @Input () placesUser;
  latitude: number = 0;
  longitude: number = 0;
  displayMap: boolean = false;
  zoom: number = 7;
  location: String;

  constructor(private locationService: LocationService, private notificationService: NotificationService) { }

  ngOnInit() {
  }

  checkLocation(){

    if(this.location === undefined){
      return false;
    }
   
    this.locationService.getLocation(this.location).subscribe(location =>{
      if(location.results.length != 0){
        this.location = location.results[0].formatted_address;
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
        this.notificationService.showNotifWarning("Place not found");
        //this.flashMessages.show("Address not found",{cssClass: 'alert-danger',timeout:3000});
      }
      
    });
  }

}
