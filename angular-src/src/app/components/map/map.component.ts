import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { NotificationService } from '../../services/notification.service';
declare var jquery: any;
declare var $: any;
declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  mapDisplayed: boolean;
  init = true;
  map;
  markers = [];
  latitude: number = 0;
  longitude: number = 0;
  zoom = 1;

  constructor(private locationService: LocationService, private notificationService: NotificationService) {
    console.log("ini map");

    locationService.componentMethodCalled$.subscribe(
      data => {
        if (data === 0) {
          this.notificationService.showNotifWarning("There is no places to see")
        } else {
          this.zoom = data.zoom;
          this.setMarkers(data);
          $("#overlay").css("display", "inline");
          this.mapDisplayed = true;
          if (this.init) {
            this.init = false;
          }
          this.setCenterMap();
          if (data.length !== 1) {
            this.setBounds();
          }

        }

      });

    locationService.onDestroy$.subscribe(
      data => {
        $("#overlay").css("display", "none");
      });

    locationService.addMarker$.subscribe(
      data => {
        this.addMarker(data);
      });
  }

  displayMap() {
    var options = {
      zoom: this.zoom,
      center: {
        lat: this.latitude,
        lng: this.longitude
      },
      fullscreenControlOptions: {
        position: 'LEFT_TOP'
      },
      mapTypeId: 'satellite'
    }
    this.map = new google.maps.Map(document.getElementById('map1'), options);
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
  setCenterMap() {
    google.maps.event.trigger(document.getElementById('map1'), 'resize');
    this.map.panTo(new google.maps.LatLng(this.latitude, this.longitude));
    this.map.setZoom(this.zoom);
  }

  setMarkers(places) {
    this.deleteMarkers();

    places.forEach(element => {
      this.addMarker(
        {
          coords: { lat: element.latitude, lng: element.longitude },
          content: element.title
        });
      this.latitude = element.latitude;
      this.longitude = element.longitude;
    });

    //this.setBounds();
  }

  deleteMarkers() {

    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
    }
    this.markers = [];
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

  ngAfterViewInit() {
    let me = this;
    window.onload = function () {
      $("#map1").css("display", "block");
      me.displayMap();
      console.log("v_i");
    }
    //google.maps.event.trigger(document.getElementById('map1'), 'resize');

    $(document).click(function (event) {
      google.maps.event.trigger(document.getElementById('map1'), 'resize');
    });
    $(document).click(function (event) {
      let targ = $(event.target).attr('class');
      let substring = "btn-show-map";

      if (targ !== undefined) {
        if (targ.indexOf(substring) === -1) {
          if (!$(event.target).closest('#map1').length) {
            if (me.mapDisplayed) {
              if ($('#overlay').is(":visible")) {
                $("#overlay").css("display", "none");
                me.deleteMarkers();
                me.mapDisplayed = false;
              }
            }
          }
        }
      }
    })

  }

  ngOnInit() {
  }

}
