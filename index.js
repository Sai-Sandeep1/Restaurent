const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const app = express();
const JSONparser = bodyParser.json();
const server = '127.0.0.1:27017';
const db = "Restaurent";

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(`mongodb://${server}/${db}`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("Database is connected Successfully");
})
.catch((err) => {
    console.log("Database connection failed");
})

const userSchema = new mongoose.Schema(
    {
        email : String,
        password : String
    }
);
const users = new mongoose.model("users", userSchema);

app.post("/signup", JSONparser, async(req,res) => {
  console.log("In the signup route");
  console.log("got data:::");
	const reqEmail = req.body.email;
  const reqPassword = req.body.password;
	console.log("read details");
    const newUser=new users(
      {
        email: reqEmail,
        password: reqPassword
      }
    );
    await newUser.save()
    .then(() => {
      console.log('Save user data at MongoDB');
      res.send("Sign-up is successful!");
    })
    .catch((error) => {
      console.error(error);
    });
  
  });
  
  
  app.post("/signin",JSONparser,async(req,res)=>
    {
      console.log("In the login route");
      const reqEmail=req.body.email;
      const reqPassword=req.body.password;
      console.log("getting:",req.body);
      const userReturns=await users.find({
          email:reqEmail,
          password:reqPassword
      });

        if(userReturns.length>0)
          {
              console.log("login successful");
              res.send("login successful");
          }
        else{
              console.log("login failed");
              res.status(404);
              res.send("login failed");
          }
  });

const visitorSchema= new mongoose.Schema({
    name: { type: String, required: true },
    NoofPeople: { type: Number, required: true },
    date: { type: Date, required: true },
    message: String
});

const visitorModel = new mongoose.model("visitor",visitorSchema);

app.get("/",(req,res)=>{
res.sendFile(__dirname+"/index.html");
});


app.post("/contact",JSONparser, async (req,res)=>{
  const name = req.body.name;
 const people = req.body.people;
  const date = req.body.date;
 const message = req.body.message;
 const visitor = new visitorModel(
    {
        name: name,
        NoofPeople:people,
        date:date,
        message:message  
    }
);

try {
    await visitor.save();
    res.status(200);
    res.send('Message sent successfully');
} catch (err) {
    console.error("Error saving visitor:", err.message);
    res.status(500).send('Failed to send message');
}
});




app.listen(3000,(req,res)=>{
    console.log("server running at port 3000");
});