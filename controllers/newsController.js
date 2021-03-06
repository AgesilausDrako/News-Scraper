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
    var counter = 1;
    var articleBody = $("div.eagle-item__body");
    // Now, we grab every h2 within an article tag, and do the following:
    articleBody.each(function(i, element) {

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
          if (counter++ === articleBody.length) {
            res.redirect("/articles");
          }
        });
      }
    );
  });
  
  router.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find({}).populate("notes").exec(function(error, articles) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      // Or send the doc to the browser as a json object
      else {
        // console.log(articles);
        res.render("articles", {articles});
      }
    });
  });
  
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
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: {"notes":doc.id} }, { new: true })
      // Execute the above query
      .exec(function(err, newdoc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          console.log(newdoc)
          res.json(newdoc);
        }
      });
    }
  });
});

router.put("/articles/put/:id", function(req, res) {
    // Use the article id to find and update it's saved state
    Article.update({ "_id": req.params.id }, { "saved": true }, { multi: true }, function(err, article) {  
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

router.post("/articles/note/delete/:id", function(req, res) {
    // Use the note id to find and delete it
    Note.findByIdAndRemove(req.params.id, function (err, note) {  
      if(err) {
        console.log(err);
      } else {
        console.log("clicked");
        res.send(note);
      }
  });
});

// SAVED ROUTES
router.get("/saved", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}).populate("notes").exec(function(error, articles) {
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
      Article.findOneAndUpdate({ "_id": req.params.id }, {$push: {"notes":doc}}, { new: true })
      // Execute the above query
      .exec(function(err, newdoc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          console.log(newdoc)
          res.json(newdoc);
        }
      });
    }
  });
});

router.put("/saved/put/:id", function(req, res) {
    // Use the article id to find and update it's saved state
    Article.update({ "_id": req.params.id }, { "saved": false }, { multi: true }, function(err, article) {  
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

router.post("/saved/note/delete/:id", function(req, res) {
    // Use the note id to find and delete it
    Note.findByIdAndRemove(req.params.id, function (err, note) {  
      if(err) {
        console.log(err);
      } else {
        console.log("clicked");
        res.send(note);
      }
  });
});

// Export routes for server.js to use.
module.exports = router;