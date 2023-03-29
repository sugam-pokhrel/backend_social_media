const router=require('express').Router();
const {check,validationResult} =require('express-validator');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
var jwt = require('jsonwebtoken');
const config=require('config');

const User=require('../../models/Users');




// route      GET api/users
//access      Public
router.post('/',[    check('name','Name is required').not().isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password','enter the password with 6 or more character').isLength({min:6})
],
async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const{name,email,password}=req.body;

  try {

    let user=await User.findOne({email})

       //see if the users exists

    if(user){
        return res.status(400).json({errors:[{msg:'User already exists'}]});
    }   


   //see users gravatar


   const avatar=gravatar.url(email,{
    s:'200',
    r:'pg',
    d:'mm'
   })

   user=new User({
    name,
    email,
    avatar,
    password
   });


 //encrypt password

   const salt=await bcrypt.genSalt(10);
   user.password=await bcrypt.hash(password,salt);

   await user.save();





 jwt.sign({ id: user.id }, config.get('jwtSecret'),{ expiresIn: '1h' },  function(err, token) {
  console.log(token);
}); 

   //return JWT


  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error')
    
  }








    res.send('User registered');
});

module.exports= router;