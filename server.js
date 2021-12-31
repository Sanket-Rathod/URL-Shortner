//all the required stuffs

const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()
const sid = require('./models/base62Hashing');
var counter =1000000;

//connect database named urlshortner
mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

//set application
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))//since url is used in RESTAPIs and in app we tell the machine that it is urlencoded. extended is false.

//load the webpage with index.ejs document and all shorturls created
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

//whenever URL is added, store that url in database while creating it's short url. 
app.post('/shortUrls', async (req, res) => {
  //we need to add check so that same short URL is not added for same counter everytime the app is restarted.
  var check = 1;
  //increment the counter and find such a short URL which does not exists in the database. 
  while(check!=null){
    var shortId = sid(++counter);//short url is created 
    var check = await ShortUrl.findOne({short:shortId})
    if(check!=null)counter++;
  }
  //Add the newly found short URl in database
  await ShortUrl.create({ full: req.body.fullUrl,short:shortId })//Both urls are added in database

  res.redirect('/')//redirect the webpage back to it's previous link
})

//when shortUrl [A1B2C3D] is added after host eg localhost:3000/A1B2C3D find the short URL in database. 
//if not found then give error. If found then increment the click and redirect the window to it's full URL.
app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
//port is 3000 for local system
app.listen(process.env.PORT || 3000);