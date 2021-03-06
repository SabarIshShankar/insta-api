require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./routes/auth");
const user = require("./routes/user");
const post = require("./routes/post");
const connectToDb = require("./utils/db");
const errorHandler = require("./middleware/errorHandler");


const app = express();

connectToDb();
app.use(express.json());
app.use(cors());


app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/posts", post);


app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(
    PORT,
    console.log(`${process.env.NODE_ENV} at ${PORT}`)
);