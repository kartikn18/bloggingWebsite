const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const user = require('./models/user');
const bcrypt = require('bcrypt');
const secret = 'helloguys';
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const postModel = require('./models/post');

// Connect to MongoDB
mongoose.connect('mongodb+srv://mayank_18:kartik18@cluster0.zmq1hky.mongodb.net/authusers?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
  console.log('Connected to MongoDB');
}).catch((err)=>{
  console.error('Failed to connect to MongoDB', err);
});

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Page rendering routes
app.get('/signup-page', (req, res) => {
  res.render('signup');
});

app.get('/login-page', (req, res) => {
  res.render('login');
});

app.get('/dashboard', isloggedIn, async (req, res) => {
  try {
    const exitsuser = await user.findOne({ email: req.user.email }).populate('posts');
    const allPosts = await postModel.find({}).populate('user', 'username').sort({ createdAt: -1 });
    res.render('dashboard', { user: exitsuser, posts: allPosts });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.get('/profile-page', isloggedIn, async (req, res) => {
  try {
    const exitsuser = await user.findOne({ email: req.user.email }).populate('posts');
    res.render('profile', { user: exitsuser });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// signup post 
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all the details' });
  }

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).json({ message: 'Something went wrong' });
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) return res.status(500).json({ message: "Something went wrong" });
      const newuser = await user.create({
        username,
        email,
        password: hash
      });
      const token = jwt.sign({ email }, secret);
      res.cookie('token', token, { httpOnly: true });
      res.status(201).json({ message: "User created successfully", newuser, redirect: "/dashboard" });
    });
  });
});

//login 
app.post('/login',async(req,res)=>{
  const{email,password} = req.body;
  const currentuser =  await user.findOne({email});
  if(!currentuser){
    return res.status(400).json({message:'User not found'});
  }
  bcrypt.compare(password,currentuser.password,(err,result)=>{
    if(err) return res.status(500).json({message:'Something went wrong'});
    if(!result) return res.status(400).json({message:'Invalid credentials'});
    const token = jwt.sign({email},secret);
    res.cookie('token',token,{httpOnly:true});
    res.status(200).json({message:'Login successful', redirect: "/dashboard"});
  })
})

//user profile
app.get('/profile',isloggedIn,async(req,res)=>{
  const  exitsuser =  await user.findOne({email:req.body.email}).populate('posts');
  if(!exitsuser) return res.status(400).json({message:'User not found'});
  res.status(200).json({message:'You are in profile page',exitsuser});
})
  
//users post 

app.post('/posts', isloggedIn, async (req, res) => {
  //console.log(req.body);
    const exitsuser = await user.findOne({ email: req.user.email });
    if (!exitsuser) return res.status(400).json({ message: 'user not found' });

    const {content} = req.body;
    if (!content) return res.status(400).json({ message: 'content is required' });

    const post = await postModel.create({
        user: exitsuser._id,
        content
    });

    exitsuser.posts.push(post._id); 
    await exitsuser.save();

    res.json({ message: 'Post created successfully', post });
});

//likes
app.post('/likes/:id',isloggedIn,async(req,res)=>{
  const post = await postModel.findOne({_id:req.params.id});
  if(!post) return res.status(400).json({message:'Post not found'});
  
  const exitsuser = await user.findOne({ email: req.user.email });
  post.likes.push(exitsuser._id);
  await post.save();
  res.status(200).json({message:'Post liked successfully',post});
})

//editpost

app.post('/editpost/:id',isloggedIn,async(req,res)=>{
  const post = await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content});
  if(!post) return res.status(400).json({message:'Post not found'});
  res.status(200).json({message:'Post updated successfully',post});
})


//logout
app.post('/logout',(req,res)=>{
  res.cookie('token','',{httpOnly:true,maxAge:0});
  res.status(200).json({message:'Logout successful', redirect: "/login-page"});
})

//middleware
function isloggedIn(req,res,next){
  if(req.cookies.token==''){
    return res.redirect('/login-page');
  }
  else{
    try {
      const data = jwt.verify(req.cookies.token,secret);
      req.user = data;
      next();
    } catch (error) {
      return res.redirect('/login-page');
    }
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});