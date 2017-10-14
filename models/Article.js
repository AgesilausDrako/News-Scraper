// Require mongoose
var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    unique: true,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    unique: true,
    required: true
  },
  summary: {
    type: String,
    unique: true,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

ArticleSchema.plugin(uniqueValidator);
// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;
