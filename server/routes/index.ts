import express from "express";
import hostRouter from "./host";
import housesRouter from "./houses";
import paymentRouter from "./stripe";
import bookingsRouter from "./bookings";
import authRouter from "./auth";
import faqRouter from "./faq";

const apiRouter = express.Router();

apiRouter.use("/host", hostRouter);
apiRouter.use("/houses", housesRouter);
apiRouter.use("/stripe", paymentRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/faq", faqRouter);

export default apiRouter;
