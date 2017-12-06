var User=require('../models/user');
var Cart=require('../models/cart');
//首页
module.exports=function(app){
	app.get('/',function(req,res){
	if(req.session.user){
		// console.log('登录成功了')
		// console.log(req.session.user)
		if(req.session.user.amdin===0){
			res.render('index',{title:'校园订水系统',user:req.session.user})
		}else{
			Cart.fetch(function(err,carts){
				if(err) return
				if(carts===null||carts===''){
					res.render('index',{title:'校园订水系统',user:req.session.user,carts:0})
				}else{
					Cart.fetch(function(err,doc){
						if(err){
							return
						}
						if(doc){
							res.render('index',{title:'校园订水系统',user:req.session.user,doc:doc})
						}
					})
				}
			})
		}
		
	}else{
		return res.redirect('/login')
	}
	
})
//signin 登录
app.post('/user/signin',function(req,res){
	var phoneNum=req.body.phoneNum
	var password=req.body.password
	User.findOne({phoneNum:phoneNum},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			// req.session.msg='0'
			console.log('not find name ')
			// res.session.msg='输入用户和密码输入错误'
			return res.redirect('/')			
		}
		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log('has a error')
			}
			if(isMatch){
				req.session.user=user
				console.log('password is Matched')
				res.redirect('/')
				return
			}else{
				console.log('password is not Matched')
			}
		})
	})
})
//loginout 登出
app.get('/loginout',function(req,res){
	delete req.session.user;
	delete app.locals.user;
	res.redirect('/')
})
//login
app.get('/login',function(req,res){
	res.render('login',{title:'校园订水系统'})
})
//signup 显示页面
app.get('/user/signup',function(req,res){
	res.render('register',{title:'注册页面'})
})

//signup 提交表单
app.post('/user/signup',function(req,res){
	var name=req.body.name;
	var phoneNum=req.body.phoneNum;
	var password=req.body.password;
	var address=req.body.address;
	var _user={name:name,password:password,phoneNum:phoneNum,address:address};
	console.log(_user);

	var user=new User(_user)
	console.log(user)
    user.save(function(err, user) {
        if (err) {
          console.log(err)
       }
       // console.log(user.name);
       res.redirect('/login')
    })
})

//paying 支付 
app.get('/cart/paying/:id',function(req,res){
	var id=req.params.id
	var name=req.session.user.name
	var phoneNum=req.session.user.phoneNum
	var address=req.session.user.address

	if(!req.session.user){
		console.log('真的没用户信息')
		res.redirect('/login');
	}
	Cart.findOne({uid:id},function(err,doc){
		if (err) {
			return
		}
		if(doc===null||doc===''){
			var cartnew=new Cart({uid:id,name:name,phoneNum:phoneNum,address:address})
			cartnew.save(function(err,doc){
				if (err) {
					return
				}
				if (doc) {
					console.log(doc)

				}
			})
		}else{
			cartnew=new Cart({uid:id,name:name,phoneNum:phoneNum,address:address})
			cartnew.save(function(err,doc){
				if (err) {
					return
				}
				if (doc) {
					console.log(doc)

				}
			})
		}
	})
	// res.redirect('/payed')
}
)
//payded 显示页面
app.get('/payed',function(req,res){
	var uid=req.session.user._id
	console.log(uid)
	// console.log(uid)
	if(!req.session.user){
		res.redirect('/login')
	}else{
	Cart.find({},function(err,carts){
		if(err) return
			// console.log(carts)
	res.render('cart',{title:'我的订单',carts:carts})
	})
	}

})
//reached 设置
app.get('/reached/:id',function(req,res){
	var _id=req.params.id
	var uid
	var name
	var phoneNum
	var address
	
	if (!req.session.user) {
		res.redirect('/login')
	}else{
		Cart.remove({_id:_id},function(err){
			if (err) {
				return
			}
			var cartnew=new Cart({_id:_id,pay:true,reached:true})
			cartnew.save(function(err,doc){
				if (err) {
					return
				}
				res.redirect('/')
			})
		})
		
			
	}
})
}
