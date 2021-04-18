const express = require('express')
const app = express()
const mongoose = require('mongoose');
const shorturl = require('./models/shorturl.js');
const port = process.env.PORT || 4000;
const ShortURL = require('./models/shorturl.js')
const {
    dburl,
    token
} = require('./config.json')
const fs = require('fs')
const shortId = require('shortid')



// app.set('view engine', 'ejs')
// app.use(express.urlencoded({
//     extended: false
// }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortURL.find()
    res.send({
        "endpoints": {
            "/urls": "lists all urls, requires token",
            "/add": "add short, requires full and token, short is optional",
            "/delete": "remove from db, requires short and token",
            "/[shortUrl]": "redirects to that short url in db, no token needed"
        }
    })
})

app.get('/urls', async (req, res) => {
    if (req.query.token != token) return res.send('token invalid or not provided')
    let urls = await ShortURL.find()
    res.send({
        "urls": urls
    })
})

app.get('/add', async (req, res) => {
    if (req.query.full == null) return res.send('no url')
    if (req.query.short == null) return res.send('no short url')
    let finddupe = await ShortURL.find({
        short: req.query.short
    })
    if (finddupe) return res.send('no duplicates')

    if (req.query.token == token) {
        await ShortURL.create({
            full: req.query.full,
            short: req.query.short || shortId.generate()
        })
        res.send(`Success! Added ${req.query.full} as ${req.query.short} with 0 clicks.`)
    } else {
        res.send('token invalid or not provided')
    }

})

app.get('/delete', async (req, res) => {
    if (req.query.token == token) {
        let short = req.query.short;
        if (short == null) {
            return res.send('not allowed my guy')
        }
        let url = await ShortURL.findOne({
            short: short
        })
        url.delete()
        res.send(`Success! Deleted ${req.query.short} which redirected to ${req.query.long}`)
    } else {
        res.send('token invalid or not provided')
    }

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
    app.listen(port, () => {
        console.log(`listeninging on port ${port}.`)
        console.log(`to see all enpoints go to localhost:${port}/ and make sure to put a token in config.json`)
    })
}).catch((err) => {
    throw 'oof sad error was caught, for convenience i have dumped it into a log file in case you want that, b-but ill display it for you >w<'
    console.log(err)
    fs.writeFile('log.txt', err)
})


// app.post('/short', async (req, res) => {
//     await ShortURL.create({
//         full: req.body.fullUrl,
//         short: req.body.shortUrl || shortId.generate()
//     })
//     res.redirect('/')
// })