import dotenv from "dotenv";
import { response } from "../helpers/response.js";

dotenv.config();

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return response(res, 401, false, "", "api key invalida o faltante");
  }

  next();
};
