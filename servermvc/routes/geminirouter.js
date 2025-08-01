const express = require("express");
const geminirouter = express.Router();
const geminiController = require("../geminicontroller/geminicontroller");
const {ValidateTokenn2}=require("../config/validate");
geminirouter.post("/ask",ValidateTokenn2, geminiController.askForNeedy);
geminirouter.post("/askdonor",ValidateTokenn2, geminiController.askForDonor);

module.exports = geminirouter; 