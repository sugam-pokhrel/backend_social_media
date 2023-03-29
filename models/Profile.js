const mongoose=require('mongoose');


const ProfileSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    company:{
        type:String,
        
    },
    website:{
        type:String,

    },
    location:{
        type:String,
        
    }
    ,
    status:{
        type:String
    },
    skills:{
        type:[String],
        
    }

});

module.exports=mongoose.model('profile',ProfileSchema);


