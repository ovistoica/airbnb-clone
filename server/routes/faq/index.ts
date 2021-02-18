import express from "express";
import { Question } from "../../../models";

const faqRouter = express.Router();

faqRouter.get("/", async (_, res) => {
  try {
    const response = await Question.findAll();

    const questions = response.map((question: any) => question.dataValues);

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        questions,
      })
    );
  } catch (err) {
    res.writeHead(500, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        status: "error",
        message: err.message,
      })
    );
  }
});

export default faqRouter;
