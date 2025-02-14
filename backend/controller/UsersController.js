const { models: { User,Role } } = require('../models/index');
const { Op } = require("sequelize");
module.exports = {
    delete:async function(req,res){
        const { slctdUsers } = req.body;
        await User.destroy({
            where: {
              googleId: slctdUsers || [],
            },
          });
        res.redirect('/admin/users');
    },
    enableAdmin:async function(req,res){
        const { slctdUsers } = req.body;
        await User.update(
            {isAdmin:true},
            {
                where:{
                    googleId:slctdUsers || []
                }
            }
        );
        
        res.redirect('/admin/users');
    },
    disableAdmin:async function(req,res){
        const { slctdUsers } = req.body;
        await User.update(
            {isAdmin:false},
            {
                where:{
                    googleId:slctdUsers || []
                }
            }
        );
        
        res.redirect('/admin/users');
    },
    enableAppointment:async function(req,res){
        const { slctdUsers } = req.body;
        await User.update(
            {canCreateAppointment:true},
            {
                where:{
                    googleId:slctdUsers || []
                }
            }
        );
        
        res.redirect('/admin/users');
    },
    disableAppointment:async function(req,res){
        const { slctdUsers } = req.body;
        await User.update(
            {canCreateAppointment:false},
            {
                where:{
                    googleId:slctdUsers || []
                }
            }
        );
        
        res.redirect('/admin/users');
    },
    read:async function(req,res){
        res.locals.content = 'user/user';
        
        const { count, rows } = await User.findAndCountAll({
            where:{
                email:{
                    [Op.substring]: res.locals.admin.users.input.srch,
                }
            },
            include:{
                model:Role,
                // as:'group',
            },
            offset: (res.locals.admin.users.input.page * 10) - 10,
            limit: 10,
        });
        res.locals.admin.users.permissions = (await Role.findAll({attribute:['name']})).map((el)=>el.name);
        res.locals.admin.users.users = rows;
        res.render('./admin/drawer');
    },
    updateRole:async function(req,res){
        const {roleName} = req.params;
        const {slctdUsers} = req.body;
        await User.update(
            {roleName:roleName},
            {
                where:{
                    googleId:slctdUsers || []
                }
            }
        );
        res.redirect('/admin/users');
    },
    deleteUsers:async function(req,res){

        await User.destroy({
            where:{
                googleId:req.body.slctdUsers || []
            }
        });
        req.flash('success','Successfully delete users.')
        res.redirect('/admin/users');
    },

    findOrCreate: async (profile) => {
        const [user] =  await  User.findOrCreate({
            where: { googleId: profile.id },
            defaults:{
                picture:profile._json.picture,
                name:profile.displayName,
                email:profile._json.email
            },
            include: Role
        })
        return user
    },
    findOne: async (id)=> {
        
        const user =await User.findOne({ where: { "googleId": id } });
        return user;
    }
}