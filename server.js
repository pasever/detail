const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  request = require('request'),
  exphbs = require('express-handlebars'),
  logger = require('morgan'),
  PORT = process.env.PORT || 8000,
  app = express(),
  db = require('./models'),
  bcrypt = require('bcrypt');
  let error;

//session storage module
//const session = require('express-session');
//const MongoStore = require('connect-mongo')(session);

// deleting the session after logout
// app.get('logout', (req, res) =>{
//   if(req.session) {
//     req.session.destroy(err => {
//       throw err;
//     }) else {
//       res.redirect('/');
//     }
//   }
// });

//setting up our session
// app.use(session({
//               secret: "I love New York",
//               resave: true,
//      saveUnitialized: false,
//   mongooseConnection: db
// }));
async function verifyUser(email, password) {
    const user = await db.User.findOne({email});
    const dbPassword = user.password;
    const isValid = await bcrypt.compare(password, dbPassword);
    return isValid;
}

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(logger("dev"));

mongoose.connect("mongodb://localhost/detais");
mongoose.connection.on('error', console.error.bind(console, 'connection error'));

app.engine("handlebars", exphbs({
  defaultLayout: "main",
  layoutsDir: app.get('views') + '/layouts',
  partialsDir: [app.get('views') + '/partials']
}));

app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res, next) => {
 
  const { email, password } = req.body;
  
  try {
    const isValid = await verifyUser(email, password, next);
    res.json({
      isValid
    });
  } catch (err) {
    next(err);
  }

});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
  console.log(req.body);

const {firstName, lastName, email, password, confirmedPassword } = req.body;

if (password !== confirmedPassword) {
  error = new Error("Passwords don't match!");
  res.render('signup', { error });
  console.log(error);
  error = "";
} 

  // if ( firstName && lastName && email && password ) {
  //   if (req.body.password !== req.body.confirmedPassword) {
  //     const error = new Error("Passwords should match");
  //     error.status = 400;
  //     console.log(error.status);
  //   }

  //   const newUser = {
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     password: req.body.password,
  //     email: req.body.email
  //   };

  //   db.User
  //     .create(newUser, (err, user) => {
  //       if (err) throw err;
  //       else {
  //         res.redirect("/");
  //       }
  //     });

  // } else {
  //   const error = new Error('All fields are required');
  //   error.status = 400;
  //   console.log(error.status);
  // }
});

function handleUnexpectedError(err, req, res, next) {
  err.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
  console.warn('THERE WAS AN UNEXPECTED ERROR');
}
app.use(handleUnexpectedError);
app.listen(PORT, () => console.log("🌎 Express app is live on port:", PORT));