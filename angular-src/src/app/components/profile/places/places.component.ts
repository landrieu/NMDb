import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { LocationService } from '../../../services/location.service';
import { NotificationService } from '../../../services/notification.service';
import { AuthService } from '../../../services/auth.service';
declare var google: any;
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.css']
})
export class PlacesComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() placesUser;
  @Input () isMyProfile;
  latitude: number = 0;
  longitude: number = 0;

  zoom: number = 7;
  location: String;
  type: String= "toSee";
  title: String;

  markersToSee = [];
  markersSeen = [];

  addTitleDisplayed: boolean = false;

  showMap: boolean = false;
  map;
  markers = [];

  constructor(private locationService: LocationService, private notificationService: NotificationService, private authService: AuthService) { }

  ngOnInit() {
    /*this.authService.getProfile().subscribe( data => {
      data.user.placesToSee.forEach(element => {

      });
    })*/
  }

  ngAfterViewInit(){
  
  }

  showMapToSee() {
    this.locationService.callComponentMethod(this.placesUser.placesToSee, this.zoom);
  }

  showMapSeen() {
    this.locationService.callComponentMethod(this.placesUser.placesSeen, this.zoom);
  }

  setMarkers(places) {
    this.deleteMarkers();
    this.displayMap();

    places.forEach(element => {
      this.addMarker(
        {
          coords: { lat: element.latitude, lng: element.longitude },
          content: element.title
        });
      this.latitude = element.latitude;
      this.longitude = element.longitude;
    });
    this.setCenterMap();
    this.setBounds();
  }

  setBounds() {
    if (this.markers.length > 1) {
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < this.markers.length; i++) {
        bounds.extend(this.markers[i].getPosition());
      }
      this.map.fitBounds(bounds);
    }
  }

  setCenterMap() {
    this.map.panTo(new google.maps.LatLng(this.latitude, this.longitude));
  }
  hideMap() {
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
  }
  displayMap() {
    let coords = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.locationService.callComponentMethod([coords], this.zoom);
    /*$('#map').css('height', '400px');
    google.maps.event.trigger(document.getElementById('map'), 'resize');
    this.map.panTo(new google.maps.LatLng(this.latitude, this.longitude));
    this.map.setZoom(this.zoom);*/
  }

  checkLocation() {
    if (this.location === undefined) {
      return false;
    }

    this.locationService.getLocation(this.location).subscribe(location => {
      if (location.results.length != 0) {
        this.location = location.results[0].formatted_address;
        this.latitude = location.results[0].geometry.location.lat;
        this.longitude = location.results[0].geometry.location.lng;
        //this.deleteMarkers();
        /*this.addMarker({
          coords: {
            lat: this.latitude,
            lng: this.longitude
          }
        })*/
        //this.displayMap();
        this.zoom = 4;
        if (location.results[0].address_components.length >= 3) {
          this.zoom = 7;
        }
        if (location.results[0].address_components.length >= 5) {
          this.zoom = 12;
        }
        if (location.results[0].address_components.length >= 7) {
          this.zoom = 16;
        }
        this.addTitleDisplayed = true;
      } else {
        this.notificationService.showNotifWarning("Place not found");;
      }
    });
  }

  deleteMarkers() {
    
    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
  }

  addPlace() {
    let type;
    if (this.type === "toSee") {
      type = false;
    } else {
      type = true;
    }
    console.log(new Date());
    
    let obj = {
      longitude: this.longitude,
      latitude: this.latitude,
      seen: type,
      title: this.title,
      id: this.placesUser._id,
      address: this.location,
      timeStamp: new Date()
    }

    this.locationService.addPlace(obj).subscribe(data => {
      if (data.success === true) {
        this.notificationService.showNotifSuccess(data.msg);
        this.authService.getProfile().subscribe(user => {
          if (user) {
            this.placesUser = user.user;
            this.title = "";
            console.log(this.placesUser);
          }
        })
      } else {
        this.notificationService.showNotifSuccess(data.msg);
      }
    });
  }

  ngOnDestroy() {
    this.locationService.Destroy();
    google.maps.event.clearInstanceListeners(window);
    google.maps.event.clearInstanceListeners(document);
    this.deleteMarkers();
    
  }

  addMarker(props) {
    var marker = new google.maps.Marker({
      position: props.coords,
      map: this.map
    })

    if (props.content) {
      var infoWindow = new google.maps.InfoWindow({
        content: props.content
      })

      marker.addListener('click', function () {
        infoWindow.open(this.map, marker);
      });
    }
    this.markers.push(marker);
  }

  deletePlace(timeStamp, type) {
    console.log(this.placesUser);
    
    console.log(timeStamp);
    
    let param = {
      type: type,
      timeStamp: timeStamp,
      id: this.placesUser._id
    }
    
    this.locationService.deletePlace(param).subscribe(data => {
      if (data.success === true) {
        this.notificationService.showNotifSuccess(data.msg);

        
        this.authService.getProfile().subscribe(user => {
          if (user) {
            this.placesUser = user.user;
          }
        })
      } else {
        this.notificationService.showNotifDanger(data.msg);
      }
    })
  }
  arrayNotEmpty(array) {
    if (array) {
      if (array.length > 0) {
        return true;
      }
    }
    return false;
  }

}
