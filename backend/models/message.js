const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    
    from:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },

    origin:{
      type:mongoose.Types.ObjectId,
      ref:'User',
      default:null
    },

    createdAt:{
        type:Date, 
        default: Date.now
    },

    type:{
      type:String,
      enum:['Text', 'Files', 'Vote', 'Reply'],
      required:true
    },

    edited:{
      type:Boolean,
      default:false
    },

    forwarded:{
      type:Boolean,
      default:false
    },

    seen:{
      type: Boolean,
      default:false
    },
    
    chat:{
        type:mongoose.Types.ObjectId,
        ref:'Chat',
        required:true
    },

    comments:[{
      type: mongoose.Types.ObjectId,
      ref: 'Comment'
    }]

}, { discriminatorKey:'type'})


const Message = mongoose.model('Message', MessageSchema)


const TextMessageSchema = new mongoose.Schema({
  msg:{
    type:String,
    maxLength:120,
  },
})

const VoteMessageSchema = new mongoose.Schema({
  
  topic:{
    type:String,
    maxLength:40,
    minLength:5,
    required:[true, 'Please provide the topic']
  },
  options:{
    type:[String],
    validate:{
      validator: function(array) {
        return array.length >= 2 && array.length <= 8
      },
      message:'provide a minimum of 2 or maximum of 8 options'
    },
    required:[true, 'Please provide options']
  },
  allVotes:[{
    voter:{
      type:mongoose.Types.ObjectId,
      ref:'User',
      required:true
    },
    selectedOption:{
      type:Number,
      required:true
    }
  }],
})

const FileMessageSchema = new mongoose.Schema({

  files:[{
    name:{
      type:String,
      required:true
    },
    URL:{
      type:String,
      required:true
    },
    type:{
      type:String,
      required:true
    },
    size:{
      type:Number,
      required:false
    }
  }
],

  comment:{
    type:String,
    maxLength:100
  },
})

const ReplyMessageSchema = new mongoose.Schema({

  msg:{
    type:String,
    maxLength:120,
  },
  ref:{
    type: mongoose.Types.ObjectId,
    ref:'Message',
    required:true
  },

})


const TextMessage = Message.discriminator('Text', TextMessageSchema)

const VoteMessage = Message.discriminator('Vote', VoteMessageSchema)

const FileMessage = Message.discriminator('Files', FileMessageSchema)

const ReplyMessage = Message.discriminator('Reply', ReplyMessageSchema)


module.exports = { Message, TextMessage, VoteMessage, FileMessage, ReplyMessage };