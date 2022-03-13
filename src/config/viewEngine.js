import express from "express";
const path = require('path');
const configViewEngine = (app) => {
    app.use(express.static('./src/public'));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
    //"./src/views"path.join(__dirname, 'views') 
}
export default configViewEngine;