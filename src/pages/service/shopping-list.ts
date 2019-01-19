import { Injectable } from '@angular/core';
import { AuthService } from './auth';
import { Ingredient } from './../models/ingredient';
import{ Http,Response } from '@angular/http';
import 'rxjs/Rx'

@Injectable()
export class ShoppingListService{
 
    constructor(private http:Http,  private authService:AuthService){}
    ingredients:Ingredient[]=[];   

    addIngredient(name:string,amount:number){
        this.ingredients.push(new Ingredient(name,amount));
        console.log(this.ingredients);
    }    

    addIngredients(ingredient:Ingredient[]){
        this.ingredients.push(...ingredient);
    }

    getIngredients(){
        return this.ingredients.slice();
    }

    removeIngredient(index:number){
        this.ingredients.splice(index,1);
    }
    storeList(token:string){
       const userId=this.authService.getActiveUse().uid;    
        return this.http.put('https://ionic-recipe-da7f4.firebaseio.com/'+ userId+'/shopping-list.json?auth='+token,this.ingredients)
                .map((response:Response) => {
                        return response.json();
                })
        }

    fetchList(token:string){
		const userId=this.authService.getActiveUse().uid;  

        return this.http.get('https://ionic-recipe-da7f4.firebaseio.com/'+ userId+'/shopping-list.json?auth='+token)
                .map((response:Response) => {
                    console.log(response);
                    console.log(response.json())
                    
                        return response.json();
                })
                .do((data)=>{
                        console.log(data);
                        this.ingredients=data;
                })
    }
        
}