import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fcm-app';
  message:any = null;
  token:string = ""
  constructor() {}
  ngOnInit(): void {
    this.requestPermission();
    this.listen();
  }
  requestPermission() {
    Notification.requestPermission().then((permission) =>{
      if (permission === 'granted') {
        const messaging = getMessaging();
        getToken(messaging, 
         { vapidKey: environment.firebase.vapidKey}).then(
           (currentToken) => {
             if (currentToken) {
               console.log("Hurraaa!!! we got the token.....");
               console.log(currentToken);
               this.token = currentToken
             } else {
               console.log('No registration token available. Request permission to generate one.');
             }     }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
      }
    })
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
      this.showCustomNotification(payload)
    });
  }

  showCustomNotification (payload: any) {
    let notify_data = payload ['notification'];
    let title = notify_data['title'];
    let options = {
    body: notify_data['body' ],
    icon: "./assets/healthmagus.png",
    badge: "./assets/healthmagus.png",
    image: "./assets/healthmagus.png",
    };
    console.log("new message received. ", notify_data);
    let notify: Notification = new Notification (title, options)
    notify.onclick= event => {
    event.preventDefault();
    window.location.href='https://www.google.com';
    }
  }
}
