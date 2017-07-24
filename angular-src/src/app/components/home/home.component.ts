import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
  }

  displayNotifSuccess(msg) {
    this.notificationService.showNotifSuccess(msg);
  }
  displayNotifInfo(msg) {
    this.notificationService.showNotifInfo(msg);
  }
  displayNotifWarning(msg) {
    this.notificationService.showNotifWarning(msg);
  }
  displayNotifDanger(msg) {
    this.notificationService.showNotifDanger(msg);
  }

  ngAfterViewInit() {
    $('a').hover(function () {

    })

  }

}
