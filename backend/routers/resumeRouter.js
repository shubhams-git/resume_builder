import express from 'express'

const resumeRouter = express.Router()

resumeRouter.post("/create", authenticateUser, createResume);
resumeRouter.get("/fetch/:id", authenticateUser, getResume);
resumeRouter.put("/update/:id", authenticateUser, updateResume);
resumeRouter.delete("/delete/:id", authenticateUser, deleteResume);
resumeRouter.post("/generate-pdf/:resumeId", authenticateUser, generateResumePDF);

export default resumeRouter