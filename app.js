const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');
const postsRoute = require('./routes/posts');
require('dotenv/config');

const app = express()

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// middleware routes
app.use('/user',authRoute);
app.use('/posts',postsRoute);

//connect to the database
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Database connected successfully....");
  })
  .catch(err => console.log(err));

// Home
app.get('/',(req, res) => {
    res.send("We are on Home Page");
}); 

// listen to the port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running at port ${port}`));