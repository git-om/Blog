// Import required modules and packages
const express = require("express"); // Express framework for building web applications
const bodyParser = require("body-parser"); // Middleware for parsing request bodies
const ejs = require("ejs"); // Templating engine for rendering dynamic HTML
const _ = require("lodash"); // Utility library for various helper functions
const mongoose = require('mongoose'); // Mongoose library for MongoDB interaction

// Execute the main function which connects to the database
main().catch(err => console.log(err));

// Sample content for different sections of the website
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien...";

// Create an Express application
const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Use bodyParser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Main function that connects to the MongoDB database
async function main() {
  // Connect to the MongoDB database with the name "posts"
  await mongoose.connect('mongodb://127.0.0.1:27017/posts');

  // Define a Mongoose schema for the "post" model
  const postSchema = new mongoose.Schema({
    title: String,
    content: String
  });

  // Create a Mongoose model based on the defined schema
  const post = mongoose.model('Post', postSchema);

  // Define the route for the home page
  app.get("/", function (req, res) {
    // Find all posts from the database and render the home page with the retrieved posts
    post.find({}).then(list=>{
      res.render("home",{startingContent: homeStartingContent, posts: list});
    }).catch(err=>{
      console.log(err);
    });
  });

  // Define the route for the "compose" page
  app.get("/compose", function (req, res) {
    // Render the "compose" page, which allows users to create new posts
    res.render("compose");
  });
  
  // Define the route for creating a new post
  app.post("/compose", function(req, res){
    // Create a new post with the title and content provided in the request body
    post.create({title:req.body.postTitle, content:req.body.postBody}).then();
    // Redirect the user back to the home page after creating the post
    res.redirect("/");
  });
  
  // Define the route for individual post pages
  app.get("/posts/:postName",function(req, res){
    // Extract the requested post title from the URL and convert it to lowercase
    const requestedTitle = _.lowerCase(req.params.postName);
    
    // Find all posts from the database
    post.find({}).then(list=>{
      // Loop through the list of posts and check if any post title or ID matches the requested title
      list.forEach(function(post){
        const storedTitle = _.lowerCase(post.title);
        const storedId = _.lowerCase(post._id);
        if(storedTitle === requestedTitle || storedId === requestedTitle){
          // If a matching post is found, render the "post" page with the post's title and content
          res.render("post",{title: post.title, content: post.content});
        }
      });
    });
  });
}

// Define the route for the "about" page
app.get("/about", function (req, res) {
  // Render the "about" page with the predefined aboutContent
  res.render("about",{aboutContent: aboutContent});
});

// Define the route for the "contact" page
app.get("/contact", function (req, res) {
  // Render the "contact" page with the predefined contactContent
  res.render("contact",{contactContent: contactContent});
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
