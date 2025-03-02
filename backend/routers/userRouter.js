import express from 'express'

const userRouter = express.Router()

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/profile", authenticateUser, getUserProfile);
userRouter.put("/profile/update", authenticateUser, updateUserProfile);

export default userRouter