import express from 'express'

const adminRouter = express.Router()
adminRouter.get("/users", authenticateAdmin, getUsers);
adminRouter.delete("/delete/:id", authenticateAdmin, deleteUser);
adminRouter.post("/template", authenticateAdmin, addResumeTemplate);

export default adminRouter  