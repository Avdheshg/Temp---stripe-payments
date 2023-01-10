
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
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
  // useCreateIndex: true,  
  // useFindAndModify: true,
  useUnifiedTopology: true,
})
.then( () => console.log('DB connection successful') );

app.get("/", (req, res) => {
    res.status(200).send("<h1>Home Page</h1>");
}) 

app.use("/bookings", bookingRouter);


app.listen(3000, () => {
    console.log("** Server running on the port 4000 **");
})






 










































