import { Recipe } from './../models/recipe';
import { RecipesService } from './../service/recipe';
import { NavParams, ActionSheetController, AlertController, ToastController, NavController } from 'ionic-angular';
import { FormGroup,FormControl,Validators,FormArray } from '@angular/forms';
import { Component,OnInit } from '@angular/core';


@Component({
  selector: 'page-edit-recipe',
  templateUrl: 'edit-recipe.html',
})
export class EditRecipePage implements OnInit{
  mode="New";
  selectOptions = ['Easy','Medium','Hard'];
  recipeForm: FormGroup;
  recipe:Recipe;
  index:number;
  constructor( private navParam:NavParams, private actionSheetCtrl:ActionSheetController, private alrtControl:AlertController,
                private toastCtrl:ToastController,private recipeServie:RecipesService, private navCtrl: NavController) {}
  
  ngOnInit() {
    this.mode=this.navParam.get('mode');
    console.log(this.mode)
    if(this.mode=='Edit'){
      this.recipe=this.navParam.get('recipe');
      this.index=this.navParam.get('index');
      console.log('inside edit')
      console.log(this.recipe);
    }
    this.initializeForm();
  }  

  private initializeForm(){  
    let title=null;
    let  description=null;
    let difficulty='Medium';
    let ingredients = [];
    console.log(this.mode)
    if(this.mode=='Edit'){
      title = this.recipe.title;  
      description=this.recipe.description;
      difficulty=this.recipe.difficulty;
      for(let ingredient of this.recipe.ingredients){
          ingredients.push(new FormControl(ingredient.name,Validators.required))

      }
    }
    this.recipeForm=new FormGroup({
      'title': new FormControl(title,Validators.required),
      'description': new FormControl(description,Validators.required),
      'difficulty':new FormControl(difficulty,Validators.required),
      'ingredients': new FormArray(ingredients)
    })
  }

  onSubmit(){
    const value=this.recipeForm.value;
    let ingredients = [];
    if(value.ingredients.length > 0){
      ingredients=value.ingredients.map(name =>{
        return { name:name,amount:1};  
      });
    }
    console.log("on submit"+this.mode)
    if(this.mode=="Edit"){
      console.log(this.index);
      this.recipeServie.udateRecipe(this.index,this.recipeForm.value.title,this.recipeForm.value.description,
                          this.recipeForm.value.difficulty,ingredients);
    }
    else{
      console.log('new inside else')
          this.recipeServie.addRecipe(this.recipeForm.value.title,this.recipeForm.value.description,
                          this.recipeForm.value.difficulty,ingredients);
    }
    
                      
          this.recipeForm.reset();
          this.navCtrl.popToRoot();
           }

  onManageIngredients(){
  const actionSheet=this.actionSheetCtrl.create({
  title:"wat to do",
  buttons:  [
    {
      text:  "add",
      handler:()=>{
        this.createNewIngredientAlert().present();
      }
    },
    { 
      text:  "Remove All",
      role:'destructive',
      handler:()=>{
        const fArray:FormArray=<FormArray>this.recipeForm.get('ingredients');
        const len=fArray.length;
        if(len >0){
          for ( let i= len -1 ; i>=0 ; i--){
            fArray.removeAt(i);
          }
        }
        const toast = this.toastCtrl.create({
                message:"All ing deleted",
                duration:1500,
                position:'bottom'
              })
              toast.present();
      }
    },
    {
      text: "cancel",
      role:'cancel'
    }

  ]
});
actionSheet.present();
}
  private createNewIngredientAlert(){
    return this.alrtControl.create({
      title:'Add Ingredient',
      inputs:[
        {
          name:'name',
          placeholder:'Name'
        }
      ],
      buttons:[
        {
          text:"Canc",
          role:"cancel"
        },
        {
          text:'Add',
          handler:data=>{
            if(data.name.trim() == '' || data.name==null){
              const toast = this.toastCtrl.create({
                message:"please enter a valid value",
                duration:1500,
                position:'bottom'
              })
               toast.present();
               return;
            }
              (<FormArray>this.recipeForm.get('ingredients')).push(new FormControl(data.name,Validators.required))
          }
        }
      ]
    });   
  }
}
