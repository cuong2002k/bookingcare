import express from "express";
import APIcontroller from "../controller/APIcontroller"
let router = express.Router();
const initAPIRoute = (app) =>{
    router.get('/users',APIcontroller.getAllUsers);


    return app.use('/api/v1/',router);
}
// module.exports = initwebRoute;
export default initAPIRoute;