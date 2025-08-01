let express = require("express");
let mongoose = require("mongoose");
let app = express();
var fileuploader = require("express-fileupload");
app.use(express.json()); // for JSON data
app.use(express.static("public")); // to serve static files
app.use(express.static("uploads")); // to serve uploaded files
app.use(express.urlencoded({ extended: true })); // for URL-encoded form data
app.use(fileuploader()); // file upload support
let config = require("./config/configuration");
let cors = require("cors");
app.use(cors()); // to allow cross-origin requests
let donorrouter = require("./routes/donorrouter");
const needyrouter = require("./routes/needyrouter");
// const medicinemanagerrouter = require("./routes/medicinemanagerrouter");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


//======MODELS======
var signupmodel = require("./models/signupmodel").signupmodel();
// var Usermodel = signupmodel; // reference to user model


//=========nodemailer========
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "jpdhillon7176@gmail.com",
    pass: process.env.EMAIL_PASSWORD
  }
});
function sendmail(to, sub, msg) {
  transporter.sendMail({
    to: to,
    subject: sub,
    html: msg
  }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent successfully");
    }
  })

}
// Start the server
app.listen(7176, () => {
  console.log("Server is running on port 7176");
});

//======CONFIGURATION======
var mongodbatlasurl = config.mongodbatlasurl;
mongoose
  .connect(mongodbatlasurl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: " + err.message);
  });


// app.use((req, res, next) => {

//   console.log(req.headers)
//   next();

// })



app.use("/donor", donorrouter);
app.use("/needy", needyrouter);
app.use("/gemini", require("./routes/geminirouter"));
// app.use("/gemini", geminirouter); // ✅ CORRECT

// ===============================
// ✅ Signup Route
// ===============================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, pwd, user } = req.body;

    console.log(req.body);
    const existing = await signupmodel.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const newUser = new signupmodel({ name, email, pwd, user });
    await newUser.save();
    console.log(newUser);
    sendmail(email, "Signup successful", "You have successfully signed up with Medicine Bank", "Your user type is " + user);
    res.status(200).json({ msg: "Signup successful" });
    // window.location.reload();
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ===============================
// ✅ Login Route         
// ===============================
app.post("/login", async (req, res) => {
  try {
    const { email, pwd } = req.body;

    const user = await signupmodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.pwd !== pwd) {
      return res.status(401).json({ msg: "Incorrect password" });
    }
    sendmail(email, "Login successful", "You have successfully logged in with Medicine Bank", "Welcome back " + user.name);
    const token = jwt.sign({ email: user.email }, process.env.SEC_KEY, { expiresIn: "1h" });

    res.status(200).json({
      msg: "Login successful",
      name: user.name,
      email: user.email,
      user: user.user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});
// ===============================