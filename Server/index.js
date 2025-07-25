const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
dotenv.config();
const PORT = process.env.PORT;
const Mongouri = process.env.Mongouri;
const bcrypt = require("bcrypt");
const Salt_rounds = 10;
// my middle wares
app.use(express.json());
app.use(cors());

// connect my database
mongoose
  .connect(Mongouri)
  .then(() => console.log("Database connected"))
  .then((err) => err);

// Create my schema and model
const userschema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, require: true },
});
// Create my model
const usermodel = mongoose.model("myusers", userschema);

// Signup Route/
app.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    // Hash my password
    const hashPassword = await bcrypt.hash(password, Salt_rounds);
    const normalizedEmail = email.toLowerCase();

    const userexist = await usermodel.findOne({ email:normalizedEmail });

    if (!fullname || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }
if (userexist) {
  return res.status(400).send({message:"email already exist"})
    }
    const newuser = new usermodel({ fullname, email, password: hashPassword });
   await newuser.save();
    res.status(200).send({ message: "Registered successful" });
  } catch (err) {
      console.error("Registration error:", err);
    res.status(500).send({ message: "Unsuccesful registration" });
  }
});


// login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body
  try {
    const founduser = await usermodel.findOne({ email });
     

    //   check if email exist at first
    if (!founduser) {
       return res.status(400).send({ message: "can't found user email" });
    }
    // compare my password with hashPassword
    const is_a_match = await bcrypt.compare(password, founduser.password)
    //   check if user password is correct
    if (!is_a_match) {
      console.log("Incorrect Password");
      return res.status(400).send({ message: "Incorrect password" })
    }
    // send success message
    res.status(201).send({ message: "Log in successful" })
  } catch (err) {
    console.log("user not found ")
    console.log(err)
  }

});

app.listen(PORT, (req, res) => {
  console.log(`App running on port ${PORT}`);
});
