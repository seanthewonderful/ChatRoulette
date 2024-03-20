import express from 'express'
import ViteExpress from 'vite-express'
import morgan from 'morgan'
import session from 'express-session'

const app = express()

import dotenv from "dotenv";
dotenv.config();

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.VITE_EXPRESS_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

ViteExpress.listen(app, 9987, () => console.log('Chat here - http://localhost:9987'))