  // Click function that scrapes new articles
  $(document).on("click", "#scrape-btn", function(event) {
    event.preventDefault();
    console.log("clicked");
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
    .done(function() {
      window.location = "/articles";
    });
  });

  // Click function that saves the selected article
  $(document).on("click", ".save-btn", function(event) {
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: "/articles/put/" + thisId,
      data: {
          saved: true
        }
      })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        window.location = "/articles";
      });
  });

  // Click function that unsaves the selected article
  $(document).on("click", ".unsave-btn", function(event) {
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: "/saved/put/" + thisId,
      data: {
          saved: true
        }
      })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        window.location = "/saved";
      });
  });

  // Click function that deletes the article from the article page
  $(document).on("click", ".delete-btn", function(event) {
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/delete/" + thisId,
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        window.location = "/articles";
      });
  });

  // Click function that deletes the article from the saved page
  $(document).on("click", ".delete-btn-saved", function(event) {
    event.preventDefault();
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/saved/delete/" + thisId,
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        window.location = "/saved";
      });
  });
  
  // Click function that saves the note on the article page
  $(document).on("click", ".savenote", function(event) {
    event.preventDefault();
    if($(".textAreaInput").val() === "") {
      return false;
    } else {
      // Grab the id associated with the article from the submit button
      var thisId = $(this).attr("data-id");
      // Run a POST request to change the note, using what's entered in the inputs
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          // Value taken from note textarea
          body: $(".textAreaInput").val()
        }
      })
        // With that done
        .done(function(data) {
          // Log the response
          console.log(data);
          window.location = "/articles";
        });
      // Also, remove the values entered in the input and textarea for note entry
      $("#bodyinput").val("");
    }
  });
