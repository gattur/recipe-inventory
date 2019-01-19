import { AuthService } from './auth';
import { Http,Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Ingredient } from './../models/ingredient';
import { Recipe } from './../models/recipe';
import 'rxjs/Rx'

@Injectable()
export class RecipesService {

    constructor(private http:Http, private authService:AuthService){}
    private recipes:Recipe[]=[];

    addRecipe( title:string,description:string,difficulty:string, ingredients:Ingredient[]){
        this.recipes.push(new Recipe(title,description,difficulty, ingredients));
        console.log(this.recipes);
    }

    getRecipes(){
        return this.recipes.slice();
    }

     udateRecipe(index:number,title:string,description:string,difficulty:string, ingredients:Ingredient[]){
        this.recipes[index]=new Recipe(title,description,difficulty, ingredients);
    }

     removeRecipe( index:number){
        this.recipes.splice(index,1)
    }

    storeList(token:string){
    const userId=this.authService.getActiveUse().uid;    
        return this.http.put('https://ionic-recipe-da7f4.firebaseio.com/'+ userId+'/recipes.json?auth='+token,this.recipes)
                .map((response:Response) => {
                        return response.json();
                })
    }

    fetchList(token:string){

     const userId=this.authService.getActiveUse().uid;    
        return this.http.get('https://ionic-recipe-da7f4.firebaseio.com/'+ userId+'/recipes.json?auth='+token)
                .map((response:Response) => { 
                    const recipes:Recipe[]=response.json() ? response.json():[];
                        for( let recipe of recipes){
                            if(!recipe.hasOwnProperty('ingredients')){
                                recipe.ingredients=[]
                            }
                        }
                        return recipes;
                })
                .do((recipes:Recipe[])=>{
                    if(recipes){
                        this.recipes=recipes;
                    }
                    else{

                    }
                })
    }
}