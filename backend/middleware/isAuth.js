module.exports = function(message){
    

    return {
        isLoggin:function(req,res,next){
            if(req.isAuthenticated()){
                    
                // req.header('Referer') || '/'
                next();
            }else{
                res.status(403);
                res.render('login',{message});
            }
        },
        isAdmin:function(req,res,next){
            if(req.user.isAdmin){
                    
                next();
            }else{
                res.status(403);
                res.render('login',{message});
            }
        },
        canMakeAppointment:function(req,res,next){
            if(req.user.canCreateAppointment){
                next();
            }else{
                res.status(403);
                res.render('login',{message});
            }
        },
        can:function(...actions){
            return function(req,res,next){
                for(const action of actions){
                    if(req.user.role.permission.includes(action)) continue;
                    if(action.startsWith('*')){                        
                        res.locals.content = 'error';
                        res.render('./admin/drawer',{message});
                        return
                    }
                    res.status(403);
                    res.render('login',{message});    return       
                }
                next();
            }
        }
    }
}