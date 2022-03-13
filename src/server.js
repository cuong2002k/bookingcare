const express = require('express');
import configViewEngine from './config/viewengine';// import view engine
import initwebRoute from './route/web'; // các router của web
import initAPIRoute from './route/api';
const bp = require('body-parser')
// import connection from './config/connectDB';// connect DB
const app = express();
const port = 3000; // port localhost
// set up view engine
configViewEngine(app);// run function view engine
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
// init web route
initwebRoute(app);
//init api route
initAPIRoute(app);

// listen port
app.listen(3000,()=>{
    console.log(`listen to port ${port}`);
})