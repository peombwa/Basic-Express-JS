import "isomorphic-fetch";
import express from "express";
import bodyParser from "body-parser";
import router from './routes.js'

const app =  express();
const port = 4000;

// Add the bodyParser middelware to the express application
app.use(bodyParser.urlencoded({ extended: false }));

// Specify the url prefix and import routes
app.use('/', router);

app.listen(port, () => {
    console.log(`Success! Your application is running on port ${port}.`);
});