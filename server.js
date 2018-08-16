const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000; // this variable is for the dinamic port in heroku

var app = express();

hbs.registerPartials(__dirname + '/views/partials'); // when i added the partials, to launch nodemon I write nodemon server.js -e js,hbs i don't know exactly why but it can have render problems

app.set('view engine', 'hbs');

//app.use(express.static(__dirname + '/public')); // this create a static directory where for exampe we can access html pages like the help page with localhost:3000/help.html

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to log in the file');
    }
  });
  // is it used for example to make some controls and when they are done the app.get can work,
  // FOR EXAMPLE, if I make this function with no code inside of it the site will load in loop and will never show the pages
  next();
});

//app.use((req, res, next) => {
//  res.render('maintenance.hbs');
//}); // this function will stop the next code from executing

app.use(express.static(__dirname + '/public')); // we moved this function here because we wanted that if i write localhost:3000/help.html the page that appear is the maintenance page and not the help

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});


app.get('/',(req, res) => {
  //res.send('<h1>Hello Express !</h1>'); // with this automaticall return a html type
  res.render('home.hbs', {
    pageTitle : 'Home page',
    //currentYear : new Date().getFullYear(), // we was using the current year before we used the registerHelper that make more efficient our code // LOOK in the footed.hbs fo tee that instead of calling the variable passed we call the function created with registerHelper
    pageContent : 'This will be the coolest content in the world'
  });
});

app.get('/about',(req,res) => {
  res.render('about.hbs', {
    pageTitle : 'BlaBlaBla',
  });
});
// with this second get method if i type in the browser localhost:3000/about it will execute this function anc return the about page

app.get('/bad', (req,res) => {
  res.send({
    error : 'General error'
  });
});

app.listen(port, () => {
  console.log(`Server is up in port ${port}`);
}); // in app.listen ew can use only 1 arguent or 2 like in this example
