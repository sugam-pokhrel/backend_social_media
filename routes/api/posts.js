const router=require('express').Router();
const {check,validationResult} =require('express-validator')
const auth=require('../../middleware/auth');
const Post=require('../../models/Posts');
const Profile=require('../../models/Profile');
const User=require('../../models/Users');


// route      POST api/post
//access      Private
router.post('/',[auth,[
    check('text','text should not ben empty').not().isEmpty(),
    
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    try {
    const user=await User.findById(req.user).select('-password');

    const newPost= new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user

    })
    const post=await newPost.save();
    res.json(post);

        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg:"Server error"})
        
    }

   
});

//get to api/posts
//des private

router.get('/',auth,async(req,res)=>{
try {
 const posts=await Post.find().sort({date:-1});
 res.json(posts);
 
 
} catch (error) {
         console.log(error.message);
        res.status(500).json({msg:"Server error"})
           
}
});

//get to api/posts/:id
//des private

router.get('/:id',auth,async(req,res)=>{
try {
 const post=await Post.findById(req.params.id);
 if(!post){
    return res.status(404).json({msg:"post not found"});

 }
 res.json(post)
 
 
} catch (error) {
         console.log(error.message);
         if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:"post not found"});

         }
        res.status(500).json({msg:"Server error"})
           
}
});

//
//delete to api/posts/:id
//des private

router.delete('/:id',auth,async(req,res)=>{
try {
 const post=await Post.findById(req.params.id);
  if(!post){
    return res.status(404).json({msg:"post not found"});

 }


 //check the user
 if(post.user.toString() !== req.user){
    return res.status(401).send({msg:"not authorized"});

 }
 await Post.deleteOne(post)
 res.json({msg:"Post removed"})


 
 
} catch (error) {
         console.log(error.message);
         if(error.kind === 'ObjectId'){
            return res.status(404).json({msg:"post not found"});

         }
        res.status(500).json({msg:"Server error"})
           
}
});
//liking
router.put('/like/:id',auth,async(req,res)=>{
try {
    const post=await Post.findById(req.params.id);
    if(post.likes.filter(like=>like.user.toString() ===req.user).length > 0 ){
        return res.status(400).json({msg:"post already liked"});


    }

    post.likes.unshift({user:req.user});
    await post.save()
} catch (error) {
    
}
});

//disliking
router.put('/like/:id',auth,async(req,res)=>{
try {
    const post=await Post.findById(req.params.id);
    if(post.likes.filter(like=>like.user.toString() ===req.user).length === 0 ){
        return res.status(400).json({msg:"post is not liked yet" });


    }

   //get the removed index

   const removedIndex=post.likes.map(like=>like.user.toString()).indexOf(req.user)
   post.likes.splice(removedIndex,1);

   await post.save()
   res.json({post})
} catch (error) {
    
}
});

//route api/posts/comment/:id
router.post('/comment/:id',[auth,[
    check('text','text should not ben empty').not().isEmpty(),
    
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    try {
    const user=await User.findById(req.user).select('-password');
    const post=await Post.findById(req.params.id);

   
    const newComment= new Post({
        text:req.body.text,
        name:user.name,
        avatar:user.avatar,
        user:req.user

    })
    post.comments.unshift(newComment);
    await post.save()
    
    res.json(post.comments);

        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({msg:"Server error"})
        
    }

   
});


//deleting commnt

router.delete('/comment/:id/:comment_id',auth,async(req,res)=>{
    try {
        const post=await Post.findById(req.params.id)
        //pulling the comment
        const comment=post.comments.find(comment=>comment.id === req.params.comment_id);
        if(!comment){
           return res.status(404).json({msg:"Comment dosenot exists"})
        }
        if(comment.user.toString()!==req.user){
            return res.status(401).json({msg:"user not authorized"})

        }


   //get the removed index

   const removedIndex=post.comments.map(comment=>comment.user.toString()).indexOf(req.user)
   post.comments.splice(removedIndex,1);
   await post.save();
   res.json(post.comments);


    } catch (error) {
        
    }

})

module.exports= router;