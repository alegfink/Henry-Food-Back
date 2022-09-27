const { Router } = require('express');
const axios = require('axios');
const { ConnectionAcquireTimeoutError } = require('sequelize');
const { Op, Recipe, Diet, DishType, RecipeDiet, RecipeDish } = require('../db.js');
const { route } = require('./diet.js');
const router = Router();
const {validatePost, validateExistDish, validateExistDiet, indexExist} = require('./util')
const {
    API_KEY
  } = process.env;


const postApiInfo = async ()=>{
    
    const hasRecipes = await Recipe.findAll()
    if(hasRecipes.length===0){
        let apiUrl = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`); 
    
    apiUrl.data.results.forEach(async el=>{
        let stepss = el.analyzedInstructions[0]?.steps.map(s=>{
            return s.number.toString()+' '+s.step
        })
        
        asd = stepss?.join('/n')
        //<br />    
        
        await Recipe.create({
            title: el.title,
            id: el.id,
            summary: el.summary,
            healthScore: el.healthScore,
            steps: asd,
            image: el.image
        })
    })
    const dishh = await DishType.findAll()
    dishh.length===0? await DishType.bulkCreate([   
        {"name": "side dish"},
        {"name": "lunch"},
        {"name": "main course"},
        {"name": "main dish"},
        {"name": "dinner"},
        {"name": "dairy free"},
        {"name": "lacto ovo vegetarian"},
        {"name": "vegan"},
        {"name": "morning meal"},
        {"name": "brunch"},
        {"name": "breakfast"},
        {"name": "soup"},
        {"name": "salad"},
        {"name": "condiment"},
        {"name": "dip"},
        {"name": "sauce"},
        {"name": "spread"},
        {"name": "dessert"},
        {"name": "appetizer"},
        {"name": "bread"},
        {"name": "beverage"},
        {"name": "marinade"},
        {"name": "fingerfood"},
        {"name": "snack"},
        {"name": "drink"}
    ]): null
    const dietass = await Diet.findAll()
    dietass.length===0? await Diet.bulkCreate([
        {"name": "gluten free"},
        {"name": "dairy free"},
        {"name": "lacto ovo vegetarian"},
        {"name": "vegan"},
        {"name": "paleolithic"},
        {"name": "primal"},
        {"name": "whole 30"},
        {"name": "pescatarian"},
        {"name": "ketogenic"},
        {"name": "fodmap friendly"},
    ]): null
    apiUrl.data.results.forEach( async el=>{
        let dish = await DishType.findAll({
        where:{
            name: el.dishTypes
        }
        });
        let dieta = await Diet.findAll({
            where:{
                name: el.diets
            }
        })
        let recett = await Recipe.findByPk(el.id)
        await recett.setDishTypes(dish)
        await recett.setDiets(dieta)
    })}
}

router.post('/', async(req,res)=>{
    try{
    const done = await postApiInfo()
    done? res.status(202).json('salio todo bien') : res.status(404).json('ya habia info')
    }catch(err){
    res.status(404).json('algo salio mal')
    }
})

router.post('/', async(req,res)=>{
    const {title, id, summary, healthScore, steps, image, dishTypes, diets, results} = req.body
    
    try{
        
        
         results.forEach(async el=>{
             Recipe.create({
            title: el.title,
            id: el.id,
            summary: el.summary,
            healthScore: el.healthScore,
            steps: el.steps,
            image: el.image
        });
        
        })
        
        // aca busco si hay algo creado de tipos de comida, en caso de que no, lo creo
        const dishh = await DishType.findAll()
        
        dishh.length===0? await DishType.bulkCreate([   
            {"name": "side dish"},
            {"name": "lunch"},
            {"name": "main course"},
            {"name": "main dish"},
            {"name": "dinner"},
            {"name": "dairy free"},
            {"name": "lacto ovo vegetarian"},
            {"name": "vegan"},
            {"name": "morning meal"},
            {"name": "brunch"},
            {"name": "breakfast"},
            {"name": "soup"},
            {"name": "salad"},
            {"name": "condiment"},
            {"name": "dip"},
            {"name": "sauce"},
            {"name": "spread"},
            {"name": "dessert"},
            {"name": "appetizer"},
            {"name": "bread"},
            {"name": "beverage"},
            {"name": "marinade"},
            {"name": "fingerfood"},
            {"name": "snack"},
            {"name": "drink"}
        ]): null
        
        // aca busco si hay algo creado de tipos de dietas, en caso de que no, lo creo
        const dietass = await Diet.findAll()
        dietass.length===0? await Diet.bulkCreate([
            {"name": "gluten free"},
            {"name": "dairy free"},
            {"name": "lacto ovo vegetarian"},
            {"name": "vegan"},
            {"name": "paleolithic"},
            {"name": "primal"},
            {"name": "whole 30"},
            {"name": "pescatarian"},
            {"name": "ketogenic"},
            {"name": "fodmap friendly"},
        ]): null
        
        //aca guardo un arreglo con los dishtype
        results.forEach( async el=>{
            let dish = await DishType.findAll({
            where:{
                name: el.dishTypes
            }
            });
            let dieta = await Diet.findAll({
                where:{
                    name: el.diets
                }
            })
            let recett = await Recipe.findByPk(el.id)
            await recett.setDishTypes(dish)
            await recett.setDiets(dieta)
        })
        
        const recceta = await Recipe.findAll({
            include:[
                {
                    model:Diet,
                    attributes:['name'],
                    through:{
                       attributes:[],
                    }
                   },
                   {
                   model:DishType,
                   attributes:['name'],
                    through:{
                       attributes:[],
                    }
                }
            ]
        })
        console.log(recceta)
        
        
        
        recceta? res.status(202).json(recceta): res.status(404).json('no se pudieron crear las recetas')
    }catch(err){
        res.status(404).json('error primer post')
    }
})

module.exports = router;