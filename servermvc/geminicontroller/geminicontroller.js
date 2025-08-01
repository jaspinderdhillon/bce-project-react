const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.gemini_key);
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});


const generattionConfig = {
    temperature: 0.2, // Controls randomness in the output
    maxOutputTokens: 8192, // Maximum number of tokens in the response
    topP: 0.8, // Controls diversity of the output
    topK: 40, // Limits the number of highest probability tokens to consider
}

async function askForNeedy(req, resp) {
    try {
        console.log("Received request:", req.body);

        const { question } = req.body;
        if (!question) {
            return resp.status(400).json({ status: "error", message: "Question is required" });
        }

        const response = await model.generateContent(question, generattionConfig);

        let answer = response.response.text();
        answer = answer.replaceAll("json", "").replaceAll("```", "").replaceAll("json", "").replaceAll("```", ""); // Clean up the answer

        console.log("Generated answer:", answer);

        resp.json({ status: "success", data: answer });
    } catch (error) {
        console.error("Error in Gemini AI request:", error);
        resp.status(500).json({ status: "error", message: "Internal server error", error: error.message });
    }
}


async function askForDonor(req, resp) {
    try {
        console.log("Received request:", req.body);
        const { question } = req.body;
        if (!question) {
            return resp.status(400).json({ status: "error", message: "Question is required" });
        }

        const response = await model.generateContent(question, generattionConfig);
        let answer = response.response.text();
        answer = answer.replaceAll("json", "").replaceAll("```", "").replaceAll("json", "").replaceAll("```", "");
        console.log("Generated answer:", answer);
        resp.json({ status: "success", data: answer });
    }
    catch (err) {
        console.log(err.message);
        resp.status(500).json({ status: "error", message: "Internal server error", error: err.message });
    }
}

module.exports = {
    askForNeedy,
    askForDonor
};