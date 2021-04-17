const express = require('express')
const app = express()
const mongoose = require('mongoose');
const shorturl = require('./models/shorturl.js');
const port = process.env.PORT || 4000;
const ShortURL = require('./models/shorturl.js')
const {
    dburl,
    isSecure
} = require('./config.json')
const fs = require('fs')
const shortId = require('shortid')



app.set('view engine', 'ejs')
app.use(express.urlencoded({
    extended: false
}))

app.get('/', async (req, res) => {
    const shortUrls = await ShortURL.find()
    res.render('index', {
        shortUrls: shortUrls
    })
})

app.post('/short', async (req, res) => {
    await ShortURL.create({
        full: req.body.fullUrl,
        short: req.body.shortUrl || shortId.generate()
    })
    res.redirect('/')
})

app.get('/delete', async (req, res) => {
    let short = req.query.short;
    if (short == null) {
        return res.send('not allowed my guy')
    }
    let url = await ShortURL.findOne({
        short: short
    })
    url.delete()
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const url = await ShortURL.findOne({
        short: req.params.shortUrl
    })
    if (url == null) return res.sendStatus(404)
    url.clicks++
    url.save()
    res.redirect(url.full)
})

mongoose.connect(process.env.urldb || dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((result) => {
    console.log("yay! connected to database successfully!!")
    app.listen(port, () => console.log('express is listeninging on port ' + port))
}).catch((err) => {
    throw 'oof sad error was caught, for convenience i have dumped it into a log file in case you want that, b-but ill display it for you >w<'
    console.log(err)
    fs.writeFile('log.txt', err)
})