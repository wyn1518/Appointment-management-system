
const Tokens = require('csrf');
module.exports = function(req,res,next){
    if(req.isAuthenticated()){
    
        const tokens = new Tokens();
        if (!req.session.secret) {
          
          const secret = tokens.secretSync();
          
          req.session.secret = secret;
          console.log("CSRF TOKEN INITIALIZED");
        }
        const token = tokens.create(req.session.secret);
        res.locals.csrf_token = `<input type="hidden" name="csrf_token" value="${token}">`;
    
        if(req.method == "POST" && tokens.verify(req.session.secret, req.body.csrf_token)){
            console.log("MATCH CSRF TOKEN")
        }
    }
    next();
}