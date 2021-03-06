/* About the use of express and the routes */
// Single domain
// app.com - root route
// app.com/help - help route
// etc

// ATTENTION: After configuring hbs, use the command:
// nodemon src/'appname' -e js,hbs | This will make it look for hbs files

// req = request | res = response
// app.get('index', () => {}) - What we will serve. Let's say index.html or data.json

// To access some files, express will need to know the path (absolute)
const path = require('path')
const express = require('express')
const hbs = require('hbs')

// Require created modules for the app:
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__filename)
// console.log(path.join(__dirname, '../public'));
const app = express()

// New const for using a dynamic port with heroku || 3000 for our internal use
const port = process.env.PORT || 3000

// Define paths for express:
const publicDirPath = path.join(__dirname, '../public')
// Views Path. A customizable path for views. Not making it, express with hbs will look for the views folder by default. (./views), in this case, we are using it inside the templates folder.
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set express to work with HBS templating engine
// Must use a views folder with the hbs files, or use the approach below
// Set another path for the custom templates folder:
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Customize the server with app.use() - Setupt static directory to serve
app.use(express.static(publicDirPath))

/* // Not needed any more since we are serving the files, just for show:
app.get('/about', (req, res) => {
  res.send(`<h1>About page</h1>`);
}) */

// Set express to render handlebars file:
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    subTitle: 'Forecast',
    name: 'Beto Costa',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'Weather App',
    subTitle: 'About',
    name: 'Beto Costa'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Weather App',
    subTitle: 'Help',
    name: 'Beto Costa'
  })
})

app.get('/local', (req, res) => {
    forecast(req.query.latitude, req.query.longitude, (error, forecastData) =>{
      if (error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
      })
    })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: `You must provide an address to get the weather information`
    })
  }

  // Setting an empty object to be passed if an invalid address is provided:
  geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
    if (error) {
      return res.send({ error })
    }
    forecast(latitude, longitude, (error, forecastData) =>{
      if (error) {
        return res.send({ error })
      }
      res.send({
        forecast: forecastData,
        location,
        address: req.query.address
      })
    })
  });
})

// app.get('/products', (req, res) => {
//   if (!req.query.search) {
//     return res.send({
//       error: `You must provide a search term`
//     })
//   }

//   console.log(req.query.search)
//   res.send({
//     products: []
//   })
// })

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    subTitle: 'Page not found',
    errorMessage: 'The help article you are looking for was not found!',
    name: 'Beto Costa'
  })
})

// Last app.get: For 404 pages. Must be the last, because it will be used as a fallback.
app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    subTitle: 'Page not found',
    errorMessage: 'The page you are looking was not found.',
    name: 'Beto Costa'
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server is up on port ${port}.`)
})


