
const express = require("express");
const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const morgan = require('morgan')
const path = require("path");

const bookingRouter = require('./routes/bookingRoutes');
const Cars = require("./models/newCarsModel");

const app = express();

// MIDDLEWARES
app.use(express.json());    
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser()); 
app.use(morgan("dev"));     
// pug
app.set('view engine', 'pug');    
app.set("views", path.join(__dirname, "views"));


// =============   DATABASE   =================
const DB = `mongodb+srv://carWorldAvdhesh:aQw9j5XOuCWLVHnE@cluster0.kzcjw.mongodb.net/cars?retryWrites=true&w=majority`
mongoose.set('strictQuery', false);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,  
  // useFindAndModify: true,
  useUnifiedTopology: true,
})
.then( () => console.log('DB connection successful') );


// =========    AUTHENTICATION  =========================
//   =========================        =========================
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const authController = require("./controllers/authController");

const generateJWT = (id) => {
    // console.log("*** app.js =>   ***");       
    console.log("*** app.js => generateJWT  ***");
    return jwt.sign({id: id}, "this is the secret of jwt");
}

const createSendToken = (user, statusCode, res) => {
    console.log("*** app.js => createSendToken  ***");     
    const token = generateJWT(user._id);                  
  
    // COOKIE         
    const cookieOptions = {
      expires: new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
      ),
      httpOnly: true             
    };
  
    res.cookie('jwt', token, cookieOptions);   
  
    user.password = undefined;         
    res.status(statusCode).json({
      status: 'success',     
      token,
      data: {   
        user    
      }    
    });  
};
  
// ===== LOGIN  ========== 
// ===== VIEW:: LOGIN  ==========   
app.get("/login", (req, res) => {
    console.log("*** app.js => 2. /view/login  ***");
    res.status(200).render("login");
})

app.post("/login", async (req, res) => {
    console.log("*** app.js =>  /login  ***");
    try {
      
      const {email, password} = req.body;
  
      if (!email || !password) {
        return res.status(401).json({
          status: "fail",   
          message: "Please provide email and password"
        })   
      }
      
      // finding the user using email
      const user = await User.findOne({email: req.body.email}).select("+password");
      // console.log("user", user);
  
      // checking if the user exists and if entered password and the document password is correct
      if (!user || !await user.checkPassword(req.body.password, user.password)) {
        console.log("Incorrect pass");
        return res.status(401).json({
          status: "fail",
          message: "Enter correct password"     
        })
      }
      
      // creating a JWT
      // const token = jwt.sign({id: user._id}, "this is the secret of jwt");
      const token = createSendToken(user, 200, res);
  
    } catch (err) {
      console.log(err);
      res.status(401).json({
        status: "fail",
        message: err
      })
    }
  })
  
//  =====   LOGOUT    ==========
app.get("/logout", (req, res) => {
    console.log("*** app.js => 3.logout  ***");
    res.cookie("jwt", "");
    res.status(200).json({  
      status: "success",
      message: "Logged-out",  
    })
    res.status(200).render("login");
})           

// ================================================================
    
  

app.use("/bookings", authController.protect, bookingRouter);


app.get("/", authController.protect, (req, res) => { 
    res.status(200).send("<h1>Home Page</h1>");
}) 

app.get("/carDetails", authController.protect, (req, res) => { 
    res.status(200).render("carDetails");
}) 



app.listen(3000, () => {
    console.log("** Server running on the port 4000 **");
})






 





/* 
Integrate strip into frontend

    1. In tour.pug,edit buy now button which will redirect to the stripe payment page. This button will contain the ID of the car which we are booking 

    2. attach the stripe script for the front end in car details.pug
    <script src="https://js.stripe.com/v3/"></script>	

    3. Define a new file called  stripe.js in JS folder in Public folder and define the functions for the stripe

    4. Connect the the book car button in login.js so that whenever someone will click the button  from the front end then this request will be got by login.js and then it will make a get request to check out sessions. Also define the event listener for this button in this file 


*/

































