const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });


    if (existingUser) {
      return res.status(200).json({
        message: "Username or email already exists.",
      });
    }

    const user = new User({ username, email, password: hashedPassword });

    await user.save().then(() => {
      res.status(200).json({
        message: "User created successfully",
        user,
      });
    });
  } catch (error) {
    res.status(400).json({
      message: "something unexpected happened",
      error: error.message,
    });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post('/login',async (req,res)=>{
    try {
        const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"User not found"
        })
    }
    
    const hashedPassword = await bcrypt.compare(password, user.password);
    const {password:newPassword,...others} = user._doc;
    if(hashedPassword){
        return res.status(200).json({
            message:"Login successful",
            user:others
        })
    }
    else{
        return res.status(200).json({
            message:"incorrect email or password"
        })
    }
    } catch (error) {
        res.status(400).json({
            message:"something unexpected happened",
            error:error.message
        })
    }

})

router.get('/login',async (req,res)=>{
    res.render('login'); 
    

})


module.exports = router;
