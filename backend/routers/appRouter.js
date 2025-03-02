import express from 'express'

const appRouter = express.Router()
const userRouter = express.Router()
const resumeRouter = express.Router()
const adminRouter = express.Router() 


appRouter.use('/user', userRouter)
appRouter.use('/resume', resumeRouter)
appRouter.use('/admin', adminRouter)

export default appRouter