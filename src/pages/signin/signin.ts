import { LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from './../service/auth';
import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  constructor(private authService:AuthService,private loadingCtrl:LoadingController,
              private alrtCtrl:AlertController){}

onSignin(form:NgForm){
  const loading=this.loadingCtrl.create({
    content:'signing u in'
  })
  loading.present();
  this.authService.signin(form.value.email,form.value.password)
  .then(data=>{
    loading.dismiss();
    console.log(data);
  })
  .catch(data=>{
    console.log(data)
    loading.dismiss();
    const alert=this.alrtCtrl.create({
      title:'signin Failed',
      message:data.message,
      buttons:['Ok']
    })
    alert.present();
  });

}
}
