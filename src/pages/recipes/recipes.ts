import { DatabaseOptionsPage } from './../database-options/database-options';
import { ShoppingListService } from './../service/shopping-list';
import { AuthService } from './../service/auth';
import { NavController, LoadingController, PopoverController, AlertController } from 'ionic-angular';
import { Component } from '@angular/core';

import { RecipePage } from './../recipe/recipe';
import { RecipesService } from './../service/recipe';
import { Recipe } from './../models/recipe';
import { EditRecipePage } from './../edit-recipe/edit-recipe';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {

  constructor(private navCtrl:NavController, private recipeService:RecipesService,private loadingCtrl:LoadingController,
                private popoverCtrl:PopoverController,private authService:AuthService,
              private alertControler:AlertController ){}

  recipes: Recipe[];

  ionViewWillEnter(){
    this.recipes=this.recipeService.getRecipes();
  }
  onNewRecipe(){
    this.navCtrl.push(EditRecipePage,{ mode:"new"});
 }

 onLoadRecipe(index:number,recipe:Recipe){
    this.navCtrl.push(RecipePage , {index:index,recipe:recipe});
 }

 onShowOptions(event:MouseEvent){
    const loading=this.loadingCtrl.create({
      content:'please wait!!'
    });
   const popOver= this.popoverCtrl.create(DatabaseOptionsPage);
   popOver.present({
     ev:event
   });
    popOver.onDidDismiss(data=>{
          if(!data){
             return;
            } 
          if(data.action == 'load'){   
                loading.present();        
                this.authService.getActiveUse().getToken()
                  .then(
                    (token:string)=>{
                      this.recipeService.fetchList(token).subscribe(                     
                        (list:Recipe[])=>{
                          loading.dismiss();
                         this.recipes=list;
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
                      this.recipeService.storeList(token).subscribe(
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
