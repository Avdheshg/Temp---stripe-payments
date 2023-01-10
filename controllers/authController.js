

// ---------- Protect ---------------       for protecting the routes
exports.protect = async (req, res, next) => {
    console.log("*** authController.js :: protect ***");
  
    // 1. Getting the token and checking if it exists
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
          token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
          token = req.cookies.jwt;  
        }
        // console.log(token);
     
        if (!token) {
          // return res.status(401).json({
          //   status: "fail",
          //   message: "you are not logged in. Please login to get access",
          // });
          throw "No token exists"
        }
  
        // // 2. Verifying the token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        
        // console.log(decoded);  
          
        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        // console.log("currentUser", currentUser);    
        if (!currentUser) {
          return res.status(401).json({
            status: "fail",
            message: "The user belonging to this token does no longer exist.",
          });
          
        }
  
        // 4) Check if user changed password after the token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {    
          return res.status(401).json({
            status: "fail",
            message: "User recently changed password! Please log in again.",  
          });     
        }
  
        // Here means, user is logged in
        res.locals.user = currentUser;    // sending this to change the login and signup buttons into user btns
  
    } catch (err) {
        console.log("protect MW error and no token present, so sending the Login Form. Error => ", err);
        return res.status(200).render("login", {title: "Login"});
        // next();
    }  
        
    // console.log("protect MW, and calling the next MW");
    next();
}; 
  
  









