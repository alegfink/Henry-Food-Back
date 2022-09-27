const { Router } = require('express');
const { Op, Recipe, Diet } = require('../db.js');
const { route } = require('./recipe.js');
const router = Router();
const {validatePost, validateDiet} = require('./util')

router.post('/', async(req,res)=>{
    const error = validateDiet(req.body);
    if (error) return res.status(404).json("Falta enviar datos obligatorios")
    try{
        const dieta = await Diet.create({...req.body})
        dieta? res.status(202).json(dieta): null
    }catch(err){
        res.status(404).json('error primer post diet')
    }
})

router.get('/', async(req,res)=>{
    try{
    const dietas = await Diet.findAll()
    if(dietas.length===0){
        const sinDietas = await Diet.bulkCreate([
            {"name": "queseraa"},
            {"name": "otra dieta"},
            {"name": "tercera dieta"}
        ])
        return res.status(202).json(sinDietas)
    }
    return res.status(202).json(dietas)
    }catch(err){
        res.status(404).json('error con las dietas')
    }
})

module.exports = router;