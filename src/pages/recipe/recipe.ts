import { RecipesService } from './../service/recipe';
import { Ingredient } from './../models/ingredient';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { EditRecipePage } from './../edit-recipe/edit-recipe';
import { Recipe } from './../models/recipe';
import { ShoppingListService } from './../service/shopping-list';

@Component({
  selector: 'page-recipe',
  templateUrl: 'recipe.html',
})
export class RecipePage implements OnInit{

  recipe:Recipe;
  index:number;
                                  
  constructor(public navCtrl: NavController, public navParams: NavParams,private shoppingListService:ShoppingListService,
                private recipesService:RecipesService) {}

  ngOnInit(){
        this.index = this.navParams.get('index');
        this.recipe=this.navParams.get('recipe');
        console.log(this.recipe)
  
  }

  onEditRecipe(){
    this.navCtrl.push(EditRecipePage,{mode:'Edit', recipe:this.recipe,index:this.index})
  }

  onAddIngredients(){
    console.log();
    this.shoppingListService.addIngredients(this.recipe.ingredients);
  }
  onDeleteRecipe(){
    this.recipesService.removeRecipe(this.index);
    this.navCtrl.popToRoot();
  }
  
}
