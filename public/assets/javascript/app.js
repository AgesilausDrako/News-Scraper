
  $(document).on("click", "#scrape-btn", function(event) {
    event.preventDefault();
    console.log("clicked");
    $.get({
      method: "GET",
      url: "/scrape"
    })
    .done(function() {
      window.location = "/articles";
    });
  });

  $(document).on("click", ".save-btn", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      saved: {
        // Value taken from note textarea
        Boolean: true
      }
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        window.location = "/articles";
      });
  });

  $(document).on("click", ".delete-btn", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
    })
      // With that done
      .done(function(data) {
        // Log the response
        console.log(data);
        window.location = "/articles";
      });
  });
  
  // When you click the savenote button
  $(document).on("click", ".savenote", function() {
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
  });