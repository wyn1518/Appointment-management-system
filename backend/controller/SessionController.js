
const { models: { User } } = require('../models/index');
const { Op } = require("sequelize");
module.exports = {
    prepare:async function(req,res,next){
        res.locals.user = req.user;
        res.locals.isAuthenticated = req.isAuthenticated 
        res.locals.flash = function(){return req.flash();}
        
        res.locals.currentUrl = req.originalUrl.split("?")[0];
        const currentDate = req.session.currentDate = new Date();
        
        res.locals.currentDate = req.session.currentDate;
        res.locals.appointment = req.session.appointment = req.session.appointment || ({
            input:{
                year:null,
                month:null,
                day:null,
                members:null,
                time:null
            },
        
        });
       
        res.locals.admin = req.session.admin = req.session.admin || ({
            dashboard:{

            },
            appointment:{
                input:{
                    year:parseInt(currentDate.getFullYear()),
                    month: parseInt(currentDate.getMonth()),
                    code:'',
                }
            },
            schedule:{
                input:{
                    year:parseInt(currentDate.getFullYear()),
                    month: parseInt(currentDate.getMonth()),
                }
            },
            users:{
                input:{
                    srch:'',
                    
                    page:1,
                }
            },
            roles:{
                input:{
                    srch:'',
                    
                    page:1,
                }
            },
            images:{
                input:{
                    srch:'',
                    page:1,

                }
            }

        });
        let p = req.originalUrl.split('/');
        p.shift()
        p[p.length-1] = p[p.length-1].split('?')[0];
        res.locals.admin.page = {
            path : p,
            title : p[p.length-1] || null
        };
        
        next()
    },
}

