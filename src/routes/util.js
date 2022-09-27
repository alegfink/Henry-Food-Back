const { Op, Recipe, Diet, DishType } = require('../db.js');

function validatePost(body){
    if(!body.title || !body.id || !body.summary || !body.healthScore) return true;
    else return false
}

function validateDiet(body){
    if(!body.name) return true;
    else return false
}

async function validateExistDish(){
    const dish = await DishType.findAll()
    dish.length===0? true : false
}

async function validateExistDiet(){
    const diet = await Diet.findAll()
    diet.length===0? true : false
}

async function indexExist(index){
    const exist = await Recipe.findByPk(index)
    exist? true : false
}



module.exports={
    validatePost,
    validateDiet,
    validateExistDish,
    validateExistDiet,
    indexExist
}