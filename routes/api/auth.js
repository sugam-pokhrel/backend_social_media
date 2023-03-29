const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const {check,validationResult} =require('express-validator');
const config=require('config');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../../models/Users')


// route      GET api/auth
//access      Public
router.get('/',auth,async(req,res)=>{
try {
   
    let user=await User.findById(req.user).select("-password")
    res.send(user)
} catch (error) {
    res.status(500).send('server error')
}
    
});


// route      GET api/users
//access      Public
router.post('/',[   
    check('email','please include a valid email').isEmail(),
    check('password','enter the password with ').exists()
],
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const{email,password}=req.body;

  try {

    let user=await User.findOne({email})

       //see if the users exists

    if(!user){
        return res.status(400).json({errors:[{msg:'invalid credentials'}]});
    }   


    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({errors:[{msg:'invalid credentials'}]});
    }









 jwt.sign({ id: user.id }, config.get('jwtSecret'),{ expiresIn: '1h' },  function(err, token) {
 res.send({token})
}); 

   //return JWT


  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error')
    
  }








   
});
module.exports= router;