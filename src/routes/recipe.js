const { Router } = require('express');
const { ConnectionAcquireTimeoutError } = require('sequelize');
const { Op, Recipe, Diet, DishType, RecipeDiet, RecipeDish } = require('../db.js');
const { route } = require('./diet.js');
const router = Router();
const {validatePost, validateExistDish, validateExistDiet, indexExist} = require('./util')



router.get('/', async(req,res)=>{
    const {name} = req.query
    try{
        const contain = await Recipe.findAll({
        where:{
            title:{
                [Op.iLike]: `%${name}%`
                }
            },
            include: [
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
        contain.length>0? res.status(202).json(contain) : res.status(404).json('no se encontro receta con ese nombre')
    }catch(err){
        res.status(404).json('algo fallo busqueda query')
    }
})


router.get('/all', async(req, res)=>{
    try{
        const allRecet = await Recipe.findAll({
            include: [
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
        });
        
        allRecet && res.status(202).json(allRecet)
    }catch(err){
        res.status(404).json('error en el all')
    }
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params
    try{
        const receta = await Recipe.findAll({
            where:{
                id: id
            },
            include: [
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
        
        
    

        receta? res.status(202).send(...receta) : res.status(404).json('no se encontro receta por ese ID')
    }catch(err){
        res.status(404).json('error get por id')
    }
})


let index = 0;
router.post('/asd', async(req,res)=>{
    const {title, summary, healthScore, steps, diets, image, id} = req.body
    try{
        // aca genero un index porque desde el formulario no me mandan ninguno
        index++
        let x=1
        // aca genero un while preguntando si existe el id, en caso de que si, que sume 1 y vuelva a preguntar, hasta que no se repita
        while (x===1){
            const exist = await Recipe.findByPk(index)
            
            exist? index++ : x++
        }
        
        const titulo = title[0].toUpperCase()+title.slice(1)          
        const receta = await Recipe.create({
            title: titulo,
            summary,
            healthScore,
            steps,
            image,
            id: index
        })
        
        
        if (diets){
            const dieta = await Diet.findAll({
                where:{
                    name: diets
                }
            })
            const recet = await Recipe.findByPk(index)
            console.log(recet)
            await recet.setDiets(dieta)
            }
        return res.status(202).json('Recipe created')
        
    }catch(err){
        res.status(404).json('error al postear el form')
    }
})

module.exports = router;