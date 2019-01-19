import { Component } from '@angular/core';
import { NgForm }  from '@angular/forms';
import { PopoverController,LoadingController,AlertController } from 'ionic-angular'

import { AuthService } from './../service/auth';
import { DatabaseOptionsPage } from './../database-options/database-options';
import { Ingredient } from './../models/ingredient';
import { ShoppingListService } from './../service/shopping-list';

@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {

  listItem:Ingredient[]=[];
  constructor(private shoppingListService:ShoppingListService, private popoverCtrl:PopoverController,
              private authService:AuthService, private loadingCtrl:LoadingController,
              private alertControler:AlertController){}

  onAdditem(f:NgForm){
     this.shoppingListService.addIngredient(f.value.ingredientName,f.value.amount);
      f.reset();
      this. loadItem();
    }

    ionViewWillEnter(){
     this.loadItem();
    }
    private loadItem(){
    this.listItem=this.shoppingListService.getIngredients();
    }
  onCheckItem(index:number){
    this.shoppingListService.removeIngredient(index);
    this.loadItem();
  }
  onShowOptions(event:MouseEvent){
    const loading=this.loadingCtrl.create({
      content:'please wait!!'
    });
   const popOver= this.popoverCtrl.create(DatabaseOptionsPage);
   popOver.present({
     ev:event
   });
    popOver.onDidDismiss(
          data=>{
           if(!data){
             return;
           } 
          if(data.action == 'load'){   
                loading.present();        
                this.authService.getActiveUse().getToken()
                  .then(
                    (token:string)=>{
                      this.shoppingListService.fetchList(token).subscribe(                     
                        (list:Ingredient[])=>{
                          loading.dismiss();
                         this.listItem=list;
                        },
                        error=>{
                          loading.dismiss();
                            this.handleError(error.message);
                        }
                      )
                    
                    }
                  )
          }
          else if (data.action == 'store'){
             loading.present();  
                this.authService.getActiveUse().getToken()
                  .then(
                    (token:string)=>{
                      this.shoppingListService.storeList(token).subscribe(
                        (data)=>{
                          loading.dismiss();
                        },
                        error=>{
                          loading.dismiss();
                          this.handleError(error.message);
                        }
                      )
                    
                    }
                  )
          }
    })
  }
  private handleError(errorMessgae:string){
      const alert=this.alertControler.create({
        title:'An error Occured',
        message: errorMessgae,
        buttons:['Ok']
      });
      alert.present();
  }
}
