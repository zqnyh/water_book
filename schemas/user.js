var mongoose=require('mongoose')
var bcrypt=require('bcrypt')
var SALT_WORD=10
var UserSchema=new mongoose.Schema({
	name:String,
	password:String,
	phoneNum:{
		type:String,
		unique:true,
	},
	admin:{
		type:Number,
		default:0
	},
	shuipiao:Number,
	address:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})
UserSchema.methods={
	comparePassword:function(_password,cb){
		bcrypt.compare(_password,this.password,function(err,isMatch){
			if(err) return cb(err)
			cb(null,isMatch)
		})
	}
}
UserSchema.pre('save',function(next){
	var user=this
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}
	else{
		this.meta.updateAt=Date.now()
	}
	bcrypt.genSalt(SALT_WORD,function(err,salt){
		if(err)return;
			bcrypt.hash(user.password,salt,function(err,hash){
				if(err) return
					user.password=hash
				next()
			})
	})
	
})
UserSchema.statics={
	fetch:function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById:function(id,cb){
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}
module.exports=UserSchema