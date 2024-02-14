const app = require('express')();
import { connect, Schema, model } from 'mongoose';


//connect to mongodb
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

const User = model("User", UserSchema);

app.listen(3000, () => {
    console.log("server is running on port 3000");
});