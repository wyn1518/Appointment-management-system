const { models: { Role } } = require('../models/index');
const { Op ,UniqueConstraintError} = require("sequelize");
module.exports = {
    
    create:async function(req,res){
        
        const {name,permission} = req.body;
        await Role.create({
            name:name,
            permission:permission || []
        }).
        then((result)=>{
            req.flash('success', 'Successfuly created new role.');
        }).
        catch((err)=>{
            if(err.name === 'SequelizeUniqueConstraintError'){
                
                req.flash('error', 'Role name already existed. Please choose unique name.');
            }
        });

        res.redirect('/admin/roles');
    },
    read:async function(req,res){
        res.locals.content = 'role/role';
        res.locals.admin.roles.permissions = req.app.get('muba')['permissions'];
        const { count, rows } = await Role.findAndCountAll({
            where:{
                name:{
                    [Op.substring]: res.locals.admin.roles.input.srch,
                }
            },
            offset: (res.locals.admin.roles.input.page * 10) - 10,
            limit: 10,
        });
        res.locals.admin.roles.roles = rows;
        res.render('./admin/drawer');
    },
    update:async function(req,res){
        const {name,permission} = req.body;
        await Role.update(
            { 
                permission: permission || [] 
            },
            {
                where: {
                    name: name
                },
            },
        );       
        req.flash('success',`Successfuly updated ${name}'s permission list.`);
        res.redirect('/admin/roles');
 
    },
    delete:async function(req,res){
        const {slctdRoles} = req.body;
       
        await Role.destroy({
            where:{
                name:slctdRoles
            }
        })

        req.flash('success',`Successfuly deleted roles.`);

        res.redirect('/admin/roles');
    }
}