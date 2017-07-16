'use strict';

var fs = require('fs');
var express = require('express');
var app = express();

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    var allowedOrigins = ['https://narrow-plane.gomix.me', 'https://www.freecodecamp.com'];
    var origin = req.headers.origin || '*';
    if (!process.env.XORIG_RESTRICT || allowedOrigins.indexOf(origin) > -1) {
      console.log(origin);
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
    next();
  });
}

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
})
  let url= ""

app.route('/http(s)?://www.*').get(function(req, res) {
  if (req.params[0] === undefined) {
     url = `http://www.${req.params['1']}`
  }else{
     url = `https://www.${req.params['1']}`
  }

  let randomNumber = (Math.random()*9999).toFixed(0)
  // let urlShorten = `http://localhost:3000/${randomNumber}`
  let urlShorten = `https://warm-garden-64498.herokuapp.com/${randomNumber}`

  res.send({
    url: url,
    urlShorten: urlShorten
  })

  app.set('random', randomNumber)
  app.set('url', url)
});


app.route('/:num').get(function(req, res) {
  let url = app.get('url')
  let random = app.get('random')
  console.log(random);
  console.log(req.params.num);
  console.log(url);
  if (req.params.num === random) {
    res.redirect(url)
  }
})

// Respond not found to all the wrong routes
app.use(function(req, res, next) {
  res.status(404);
  res.type('txt').send({
    Error : "Not found"
  });
});

// Error Middleware
app.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status || 500).type('txt').send(err.message || 'SERVER ERROR');
  }
})

app.listen(process.env.PORT || 3000, function() {
  console.log('Node.js listening ...');
});
