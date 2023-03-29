const router=require('express').Router();
const auth=require('../../middleware/auth');

const {check,validationResult}=require('express-validator')
const Profile = require('../../models/Profile');

const User=require('../../models/Users')


// route      GET api/profile/me
//get current users profile
//access      PRIVATE
router.get('/me',auth,async(req,res)=>{
    try {
            const profile=await Profile.findOne({user:req.user}).populate('user',['name','avatar']);
            if(!profile){
                return res.status(400).json({msg:"There is not profile for this user"})
            
            }

            res.send(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error");
    }
});



// route      POST api/profile/
//create or update users profile
//access      PRIVATE

router.post('/',auth,[

    check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()
],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

const{company,website,location,status,skills}=req.body;

//build profile object

const profileFields={};

 profileFields.user=req.user;
 if(company)profileFields.company=company;
 if(website)profileFields.website=website; 
 if(location)profileFields.location=location;
 if(status)profileFields.status=status;
 if(skills){profileFields.skills=skills.split(',').map(skill=>skill.trim()); 
 }
try{
    //update
    let profile=await Profile.findOne({user:req.user})
    if( profile){await Profile.findOneAndUpdate({user:req.user},{$set:profileFields},{new:true});
   
    return res.json(profile); };



    //create
    profile=new Profile(profileFields);
    await profile.save();
    res.json(profile);


}catch(err){

}
})


//get /api/profile

//the path for getting all profile

//public


router.get('/',async(req,res)=>{
    try{
        
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.send(profiles)
    
    }catch(err){

    }

});
//get /api/user/:user_id

//the path for getting a profile

//public

router.get('/user/:user_id',async(req,res)=>{
    try{
        
        const profiles=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        
        if(!profiles){
            res.status(400).json({msg:"there is no profile for this user"})
        }
        res.json(profiles);
    
    }catch(err){
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:"profile not found"})
        }

        res.status(500).json({msg:"server error"})

    }

});


//delete /api/user/:user_id

//the path for deleting a profile

//private

router.delete('/',auth,async(req,res)=>{
    try{

        //remove users post 
       await Profile.findOneAndRemove({user:req.user});


        //remove profile
        await User.findOneAndRemove({id:req.user});
       
        res.json({msg:'user deleted'});
    
    }catch(err){
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:"profile not found"})
        }

        res.status(500).json({msg:"server error"})

    }

});

//put the experience in profile

//api/profile/experience
router.put('/experience',
[auth,[
    check('title','title is required').not().isEmpty(),
check('company','company is required').not().isEmpty(),
check('from','from date is reqd').not().isEmpty()]]
,async(req,res)=>{

const errors=validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
}

const{title,company,location,from,to,current,description}=req.body;

//build profile object

const newExp={
   
    title,company,location,from,to,current,description
};




try {
    let profile=await Profile.findOne({user:req.user});
    if(profile){
        //update
        profile.experience.unshift(newExp);
        await profile.save
        return res.json(profile);

        
    }
   
} catch (error) {
    
}
});


router.delete('/experience/:exp_id',auth,async(req,res)=>{

    try {
        const profile=await Profile.findOne({user:req.user})

        const removeIndex=profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1)
        await profile.save();
        res.json(profile)
    } catch (error) {
        
    }
})

module.exports= router;