require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// Functions
var liriArtist = function(artist) {
    return artist.name;
};

// concert-this
var liriConcert = function(artist) {
  var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
  
    axios.get(queryURL).then(
      function(response) {
        var jsonData = response.data;
  
        if (!jsonData.length) {
          console.log("No results found for " + artist);
          return;
        }
  
        console.log("Upcoming concerts for " + artist + ":");
  
        for (var i = 0; i < jsonData.length; i++) {
          var show = jsonData[i];
  
          console.log(
            show.venue.name + " in " + show.venue.city +
              ", " + (show.venue.region || show.venue.country) +
              " on " + moment(show.datetime).format("MM/DD/YYYY")
          );
        }
      }
    );
};
  
// spotify-this-song
var liriSpotify = function(songName) {
  if (songName === undefined) {
    songName = "The Sign";
  }
  
  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
  
      var songs = data.tracks.items;
  
      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist(s): " + songs[i].artists.map(liriArtist));
        console.log("Song Name: " + songs[i].name);
        console.log("Preview Song: " + songs[i].preview_url);
        console.log("Album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};
  
  
  
// movie-this
var liriMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }
  
  var omdbSearch =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  
  axios.get(omdbSearch).then(
    function(response) {
      var jsonData = response.data;
  
      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  );
};
  
// do-what-it-says
var doWhatItSays = function() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    console.log(data);
  
    var dataArr = data.split(",");
  
    if (dataArr.length === 2) {
      commandArg(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      commandArg(dataArr[0]);
    }
  });
};
  
// switch function for which command to do
var commandArg = function(condition, action) {
  switch (condition) {
    case "concert-this":
      liriConcert(action);
      break;
    case "spotify-this-song":
      liriSpotify(action);
      break;
    case "movie-this":
      liriMovie(action);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
  }
};
  
// command line function to run the arguements
var runThis = function(argTwo, argThree) {
  commandArg(argTwo, argThree);
};
  
// Main Process
runThis(process.argv[2], process.argv.slice(3).join(" "));
  