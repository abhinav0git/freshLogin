const app = require('express')();
import { connect, Schema, model } from 'mongoose';
const bcrypt = require('bcrypt');

//express-session middleware
app.use(session({
    secret: "shubham",
    resave: false,
    saveUninitialized: true
}));

//connect to mongodb, db with name "myapp"
connect("mongodb://localhost/myapp", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error)=>{
        console.error("Error connecting to DB:", error);
    });

//userschema created
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    hashedPw: {
        type: String,
        required: true
    }
});

//user model created
const User = model("User", UserSchema);

//register route
app.post("/register", async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const hashedPw = await bcrypt.hash(password, 10);
    const user = await User.create({username, hashedPw});

    await user.save();
    return res.send(user);
})

//login route
app.post("/login", async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({username});
    //findOne() method returns a promise that resolves to the matching user document or null if no match. By using await, it pauses execution until the promise is resolved before assigning the result to the user constant.
    const matchStatus = await bcrypt.compare(password, user.hashedPw);
    //the password we have stored is a hashed version, and hence we cannot directly compare the values of the 2 strings. We will use bcrypt.compare(), which is the inbuilt function for comparison in the library.

    if(matchStatus == true){
        console.log("Login successful");
        req.session.user = user;
        return res.send(user);
    }
    else {
        return res.send("Invalid username or password");
    }
})

app.listen(3000, () => {
    console.log("server is running on port 3000");
});