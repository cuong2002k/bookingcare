import express from "express";
import homecontroller from '../controller/homecontroller';
import authcontroller from '../controller/authcontroller'
import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');
let router = express.Router();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,appRoot + "/src/public/img/post/");
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });


const initwebRoute = (app) =>{
    // auth
    router.get('/',authcontroller.getLoginpage);
    router.post('/check-login',authcontroller.checkLoginpage);















    // admin
    
    router.get('/admin/user/:id',homecontroller.getHomepage);

    router.get('/more/user/:userID',homecontroller.getDetailpage);

    router.get('/news-user',homecontroller.getnewuser);
    router.post('/create-new-user',homecontroller.createNewUser);
    router.post('/delete-user',homecontroller.deleteuser);
    router.get('/updateusers/:id',homecontroller.updateusers)
    router.post('/getDoctor',homecontroller.getDoctor);
    router.post('/getAdmin',homecontroller.getAdmin);
    router.post('/getPatient',homecontroller.getPatient);

    
    router.get('/get-post',homecontroller.getpost);
    router.post('/upload-profile-pic',upload.single('profile'),homecontroller.handleuploadfile)
    //patient
    // router.post('/updateusers',homecontroller.getupdateusers);
    // get home
    router.get('/home/:id',homecontroller.gethome);
    // get about
    router.get('/about/:id',homecontroller.getabout);
    // get doctors
    router.get('/doctors/:id',homecontroller.getdoctordetails);
    // get news
    router.get('/blog/:id',homecontroller.getnews);
    //get blog-details
    router.get('/blog-details/:id/:userid',homecontroller.blogdetails);
    // get contact
    router.get('/contact/:id',homecontroller.contact);
    

    
    return app.use('/',router);
}
// module.exports = initwebRoute;
export default initwebRoute;