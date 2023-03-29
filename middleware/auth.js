const jwt=require('jsonwebtoken');

const config=require('config');


module.exports=async function(req,res,next){
    //get token from the header
    if(!req.header('x-auth-token')){
        return res.send('sorry')
    }

    console.log(req.header('User-Agent'))
        const token= await req.header('x-auth-token')
        if(!token){
             res.status(401).json({msg:"No token, auth denied"})
        }
               
       
    


    //check if not token

 

    try {
        const decoded=jwt.verify(token,"mysecrettoken");

        
        req.user=decoded.id

        next();

    } catch (error) {

        res.status(401).json({msg:'token is invalid'});
        
    }
    


}