require("dotenv").config();

const { analyzeJobWithAI } = require("./services/aiService");

const testAI = async () => {
  try {
    const result = await analyzeJobWithAI(
      "MERN Stack Developer",
      "We are looking for a MERN Stack Developer with knowledge of React, Node.js, Express.js, MongoDB, JavaScript and REST APIs.",
      [
        "JavaScript",
        "React.js",
        "Node.js",
        "Express.js",
        "MongoDB"
      ]
    );

    console.log("AI RESULT:");
    console.log(result);
  } catch (error) {
    console.error("AI ERROR:");
    console.error(error.message);
  }
};

testAI();