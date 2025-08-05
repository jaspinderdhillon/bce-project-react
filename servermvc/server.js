// Required modules
let express = require("express");
let mongoose = require("mongoose");
let app = express();
let fileuploader = require("express-fileupload");
let config = require("./config/configuration");
let cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

// Load environment variables
dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Loaded ✅" : "❌ Missing");

// Middlewares
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(fileuploader());
app.use(cors());

// Routers
let donorrouter = require("./routes/donorrouter");
const needyrouter = require("./routes/needyrouter");

// Models
let signupmodel = require("./models/signupmodel").signupmodel();

// Email configuration
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendmail(to, sub, msg) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: sub,
    html: msg,
  }, (err, data) => {
    if (err) {
      console.log("Email error:", err);
    } else {
      console.log("Email sent successfully");
    }
  });
}

// MongoDB connection
mongoose.connect(config.mongodbatlasurl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err.message));

// Server listener
app.listen(7176, () => {
  console.log("Server is running on port 7176");
});

// Mount routers
app.use("/donor", donorrouter);
app.use("/needy", needyrouter);
app.use("/gemini", require("./routes/geminirouter"));

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

    sendmail(
      email,
      "Signup successful\n\n You have successfully signed up with Medicine Bank\n\n",
      "Your user type is " + user
    );

    res.status(200).json({ msg: "Signup successful" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// ===============================
// ✅ Login Route
// ===============================
app.post("/login", async (req, res) => {
  console.log("login called");
  try {
    const { email, pwd } = req.body;
    console.log("Login request received for email:", email);

    const user = await signupmodel.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.pwd !== pwd) {
      return res.status(401).json({ msg: "Incorrect password" });
    }

    console.log("User found:", user);
    console.log("sending data to nodemailer");

    sendmail(
      email,
      "Login successful\n\n You have successfully logged in with Medicine Bank\n\n",
      "Welcome back " + user.name
    );

    const token = jwt.sign(
      { email: user.email },
      process.env.SEC_KEY,
      { expiresIn: "1h" }
    );

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