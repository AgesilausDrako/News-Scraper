// Express server
var express = require("express");
// Scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Router for get/post/put/delete routes
var router = express.Router();

// Requiring our Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

// Routes
// ======
// HOME ROUTE
router.get("/", function(req, res) {
    res.render("index", {});
  });

// ARTICLES ROUTES
// A GET request to scrape the echojs website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.bbc.com/russian/news", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.eagle-item__body").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.summary = $(this).children("p.eagle-item__summary").text();

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });
    });
  },
  function(req, res) {
    res.redirect("/articles");
  });
    console.log("got articles");
  });
  
  router.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}).populate("note").exec(function(error, articles) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        res.render("articles", {articles});
      }
    });
  });
  
  
  // Grab an article by it's ObjectId
  // router.get("/articles/:id", function(req, res) {
  //   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  //   Article.findOne({ "_id": req.params.id })
  //   // ..and populate all of the notes associated with it
  //   .populate("note")
  //   // now, execute our query
  //   .exec(function(error, doc) {
  //     // Log any errors
  //     if (error) {
  //       console.log(error);
  //     }
  //     // Otherwise, send the doc to the browser as a json object
  //     else {
  //       res.json(doc);
  //     }
  //   });
  // });
  
  
// Create a new note or replace an existing note
router.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);
  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc.id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.json(doc);
        }
      });
    }
  });
});

router.put("/articles/put/:id", function(req, res) {
    // Use the article id to find and update it's saved state
    Article.update({ "_id": req.params.id }, {"saved": true}, { multi: true }, function(err, article) {  
      // Handle any possible database errors
      if (err) {
          console.log(err);
      } else {
          // Update each attribute with any possible attribute that may have been submitted in the body of the request
          // If that attribute isn't in the request body, default back to whatever it was before.
        res.send(article);
      }
  });
});


  
router.post("/articles/delete/:id", function(req, res) {
      // Use the article id to find and delete it
      Article.findByIdAndRemove(req.params.id, function (err, article) {  
        if(err) {
          console.log(err);
        } else {
          res.send(article);
        }
    });
});

// SAVED ROUTES
router.get("/saved", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}).populate("note").exec(function(error, articles) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.render("saved", {articles});
    }
  });
});

router.post("/articles/saved/delete/:id", function(req, res) {
    // Use the article id to find and delete it
    Article.findByIdAndRemove(req.params.id, function (err, article) {  
      if(err) {
        console.log(err);
      } else {
        res.send(article);
      }
  });
});

// Create a new note or replace an existing note
router.post("/saved/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);
  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc.id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.json(doc);
        }
      });
    }
  });
});

router.put("/saved/put/:id", function(req, res) {
    // Use the article id to find and update it's saved state
    Article.update({ "_id": req.params.id }, {"saved": false}, { multi: true }, function(err, article) {  
      // Handle any possible database errors
      if (err) {
          console.log(err);
      } else {
          // Update each attribute with any possible attribute that may have been submitted in the body of the request
          // If that attribute isn't in the request body, default back to whatever it was before.
        res.send(article);
      }
  });
});

// Export routes for server.js to use.
module.exports = router;