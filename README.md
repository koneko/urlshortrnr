# url shortrnr - no gui edition

just a url shortener, read this for setting it up
ok so simple, basicaly make a _config.json_ file on the root and in it put this and its just endpoints

```
{
    "dburl" : "your-mongodb-url",
    "token" : "your-security-token (make it up)"
}
```

you have to setup a mongodb database yourself, google how to setup one on atlas cuz thats how i have it >.<
anyways then just run **npm start** and it should run, obviously please install [nodejs](https://nodejs.org) first.
latest version works fine tbh
