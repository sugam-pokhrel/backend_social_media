const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const postSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'


    },
    text:{
        type:String,
        required:true
    },
    name:{
        type:String

    },
    avatar:{
        type:String

    },
    likes:[
        {
            user:{
                type:Schema.Types.ObjectId,
                ref:'user'
            }
        }
    ],
    comments:[
        {user:{
            type:Schema.Types.ObjectId,
            ref:'user'
        },
        text:{
            type:String
        },
        name:{
            type:String

        },
        avatar:{
            type:String
        },
      
    
    }
    ] ,
  date:{
            type:Date,
            default:Date.now()
        }

});

module.exports=Post=mongoose.model('post',postSchema);