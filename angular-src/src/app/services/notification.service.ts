import { Injectable } from '@angular/core';
declare var jquery:any;
declare var $ :any;

@Injectable()
export class NotificationService {

  constructor() { }

  initProgressBar(){
   /* $('.progress').css('display', 'none');
    $('.progress').css('display', 'inline');
    $('.text-percent').text(0 + "%");
    $('.progress-bar').css("width", 0 + "%" );*/

    $('.prog').fadeIn();
    $('.prog').css('width', '0');
  }

  removeProgressBar(){
    $('.progress').css('display', 'none');
    
    $('.prog').css('width', '0');
  }

  changeTextProgress(percent){
    $('.text-percent').text(percent + "%");
    $('.progress-bar').css("width", percent + "%" );

    $('.prog').css('width', percent + "%");
    
    

    if(percent === 100){
      $('.progress').fadeOut(2000);
      //$('.prog').delay(10000).css('width', "0%");
      $('.prog').delay(2000).fadeOut();
    }

    
  }

  showNotifSuccess(msg){
    $(".notification").css("background-color","#00C851");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

  showNotifInfo(msg){
    $(".notification").css("background-color","#33b5e5");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

  showNotifWarning(msg){
    $(".notification").css("background-color","#ffbb33");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

  showNotifDanger(msg){
    $(".notification").css("background-color","#ff4444");
    $('.notification-text').text(msg);
    $(".notification").fadeIn(1000);
    $(".notification").delay(3000).fadeOut(1000);
  }

}
