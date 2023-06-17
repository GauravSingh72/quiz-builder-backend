const express = require("express");
const Quiz = require("../models/quiz");
const mongoose = require("mongoose");

const router = express.Router();

// Create quiz route
router.post("/", async (req, res) => {
  try {
    const { creator, title, description, questions } = req.body;

    // Create a new quiz
    const quiz = new Quiz({
      creator,
      title,
      description,
      questions,
    });

    // Save the quiz to the database
    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully" });
  } catch (error) {
    console.error("Create quiz error:", error);
    res.status(500).json({ message: "Quiz creation failed" });
  }
});


router.get("/:quizId/leaderboard", async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const leaderboard = quiz.leaderboard || [];
    return res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get all quiz
router.get("/", async (req, res) => {
    try {
      const quizzes = await Quiz.find();
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Update quiz route
  router.put("/:quizId", async (req, res) => {
    try {
      const quizId = req.params.quizId;
  
      // Retrieve the quiz from the database
      const quiz = await Quiz.findByIdAndUpdate(quizId, req.body, { new: true });
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
  
      res.json({ message: "Quiz updated successfully", quiz });
    } catch (error) {
      console.error("Update quiz error:", error);
      res.status(500).json({ message: "Quiz update failed" });
    }
  });
  
  // Delete quiz route
  router.delete("/:quizId", async (req, res) => {
    try {
      const quizId = req.params.quizId;
  
      // Find the quiz by ID and delete it
      await Quiz.findByIdAndDelete(quizId);
  
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Delete quiz error:", error);
      res.status(500).json({ message: "Quiz deletion failed" });
    }
  });
  

module.exports = router;
