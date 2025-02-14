const { models: { Image } } = require('../models/index');

const sequelize = require('sequelize');
const { Op } = require("sequelize");
const path = require('path');
const fs = require('fs');

module.exports = {
    create: async (req,res) => {

        let {path,title,description,isPublic,tags} = req.body;
        await Image.create({
            path:path,
            title:title || '',
            description:description || '',
            isPublic:(typeof(isPublic) === 'undefined'?false:true),
            tags:tags||'',
        });

        req.flash('success', `New image is successfuly added.`); 
        res.redirect('/admin/images');
    },
    read:function(view,isPublic){
        
      
        return (async (req, res) => {
   
            res.locals.content = 'image';
            res.locals.admin.images.tags = new Set(); 
            
            let  slctdTagTemp = '';
            if(req.query.tag){
                slctdTagTemp = `,${req.query.tag},`;
            }
            res.locals.admin.images.slctdTag = req.query.tag;
            let images = res.locals.admin.images.images =  await Image.findAll({
                where:{
                    title:{
                        [Op.substring]: ((req.originalUrl).startsWith('/admin') ? res.locals.admin.images.input.srch: ''),
                    },
                    tags:{
                        [Op.substring]: slctdTagTemp,
                    },
                    isPublic:isPublic
                },
                order: [
                    ['id', 'DESC'],
                ],
            });
            let tags = res.locals.admin.images.tags || new Set();
            ( 
                await Image.findAll({attributes:['tags']})
            ).forEach((row)=>{
                row.tags.split(',').forEach(tag=>{
                    tags.add(tag);
                })
            });

            res.render(view, {
                content:"image"
            });
        });
    },
    update: async (req,res) => {
        
        let {id,title,description,isPublic,tags} = req.body;
        // console.log(req.body)
        const selectedImg =  await Image.update({
            title:title || '',
            description:description || '',
            isPublic:(typeof(isPublic) === 'undefined'?false:true),
            tags:tags||'',
        },{
            where:{ 
                id:id
            }
        });
       
        
        req.flash('success', `Image is updated successfuly.`); 
        res.redirect('/admin/images');
    },

    updatePrivacy:function(value){ 
        return (async (req,res) => {
        
            await Image.update( {
                isPublic:value
            },{
                where:{
                    path:req.body.slctdImages|| []
                }
            });
            req.flash('success', `Image privacy is updated successfuly.`); 
            res.redirect('/admin/images');
        });
    },
    togglePrivacy: async (req, res) => {
        await Image.update( {
            isPublic:sequelize.literal('CASE WHEN isPublic = 0 THEN 1 WHEN isPublic  = 1 THEN 0 END')
        },{
            where:{
                path:req.body.slctdImages|| []
            }
        });
        console.log("HELLO WORLD")
        res.redirect('/admin/images')
    },
    delete: async (req, res) => {
        const slctdImages = req.body.slctdImages || [];
        
        await Image.destroy({
            where: {
              path: slctdImages,
            },
        });

        for(let i = 0 ;i < slctdImages.length;i++){
            
            const p = path.join(__dirname, '../uploads/image/'+slctdImages[i])
            await fs.promises.unlink(p);
        
        }
      

        res.redirect('/admin/images')
    }
}