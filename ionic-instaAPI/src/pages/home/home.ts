import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { Instagram } from "ng2-cordova-oauth/core";  
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private oauth: OauthCordova = new OauthCordova();

  private instagramProvider: Instagram = new Instagram({
    clientId: "yourclientidhere",      // Register you client id from https://www.instagram.com/developer/
    redirectUri: 'http://localhost',  // Let is be localhost for Mobile Apps
    responseType: 'token',   // Use token only 
    appScope: ['basic','public_content'] 

    /*
    appScope options are 

    basic - to read a user’s profile info and media
    public_content - to read any public profile info and media on a user’s behalf
    follower_list - to read the list of followers and followed-by users
    comments - to post and delete comments on a user’s behalf
    relationships - to follow and unfollow accounts on a user’s behalf
    likes - to like and unlike media on a user’s behalf

    */ 
  });

  private apiResponse;
 
  constructor(public navCtrl: NavController, public UserService:UserServiceProvider, public storage: Storage) {

  }

  ionViewDidLoad(){
    this.storage.get("access_token").then(token=>{
      if(token){
        console.log('token',token)
        this.UserService.getInstagramUserInfo(token).subscribe(response => {
          this.apiResponse=response.data
          console.log(this.apiResponse);
        });
      }else{
        this.oauth.logInVia(this.instagramProvider).then((success:any) => {

          console.log('token',JSON.stringify(success.access_token));
  
          this.storage.set("access_token",success.access_token).then(()=>{
            console.log('saved storage');
          })
  
          /* Returns User uploaded Photos */
          this.UserService.getInstagramUserInfo(success.access_token).subscribe(response => {
            this.apiResponse=response.data;
            console.log(this.apiResponse);
          });
  
      }, (error) => {
          console.log(JSON.stringify(error));
      });
      }
    })

   
}


}
