module.exports = function(action){
    
    return function(req,res,next){
        
        if(req.isAuthenticated()){
            next();
        }else{
            res.status(403);
            res.render('login',{message});
        }
    }
}