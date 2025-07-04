if(process.env.NODE_ENV !="production"){
   require('dotenv').config() 
}
 

const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const MONGO_URL="mongodb://127.0.0.1:27017/test"
const dbUrl=process.env.ATLAS_URL;
const path=require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const Review=require('./models/review.js');
const listingsRouter=require('./routes/listing.js');
const reviewRouter=require("./routes/review.js")
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session")
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport")
const LocalStratergy=require("passport-local");
const User=require("./models/user.js")
const userRouter=require("./routes/user.js")
const searchRoutes=require("./routes/search.js")
 


main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views")
)
 
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"))
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))
app.use(searchRoutes)
const store=MongoStore.create(
    {
        mongoUrl:dbUrl,
        crypto:{
            secret: process.env.SECRET,
        },
        touchAfter:24*3600,
    }
)
store.on("error",()=>{
    console.log("Error in mongo session",err);
})
const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
}
 
 
 
 


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//app.get("/demouser",async(req,res)=>{
  //  let fakeUser= new User({
   //     email:"student@gmail.com",
   //     username:"delta-student"
  //  });

 // let registeredUser= await User.register(fakeUser,"helloworld")
 // res.send(registeredUser);
//})
 
app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use((req, res, next) => {
    res.locals.currUser = req.user || null;  // Assuming you're using Passport.js or another system to store the user object in req.user
    next();
});
/////app.get("/testListing",async(req,res)=>{
//let sampleListing=new Listing({
  //  title:"My New Villa",
   // description:"By the beach",
   // price:1200,
   // location:"Calangute,Goa",
   /// country:"India"

//});
//await sampleListing.save();
//console.log("sample was saved");
//res.send("successful testing")
//})
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err: err });
});
app.listen(8080,()=>{
    console.log("server is listening to port 8080")
})