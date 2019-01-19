import { AuthService } from './../service/auth';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

import { LoadingController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  constructor(private authService:AuthService,private loadingCtrl:LoadingController, private alertCtrl:AlertController){}

  onSignup(ngForm:NgForm){
        const loading = this.loadingCtrl.create({
          content:'Signing u UP'
        })
        loading.present();
      this.authService.signup(ngForm.value.email,ngForm.value.password)
      .then(
        (data)=>{
          loading.dismiss();
        }
      )
      .catch(
        (error)=>{
          console.log(error);
          loading.dismiss();
         const alert=this.alertCtrl.create({
           title:'signup Failed',
           message:error.message,
           buttons:['ok']
         })
          alert.present();
        }
      )
      
}

}
