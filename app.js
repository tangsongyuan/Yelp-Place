var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var flash = require("connect-flash");

var Place = require("./models/place");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

// requiring routes
var indexRoutes = require("./routes/index");
var placesRoutes = require("./routes/places");
var commentsRoutes = require("./routes/comments");

mongoose.connect("mongodb://localhost/yelp_places", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
// seedDB();  // seed the database

// passport configuration
app.use(require("express-session")({
    secret: "TSY",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/places", placesRoutes);
app.use("/places/:id/comments", commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp server get started!");
});
