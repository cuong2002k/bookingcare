import express from "express";
import homecontroller from '../controller/homecontroller';
import authcontroller from '../controller/authcontroller'
import multer from 'multer';
import path from 'path';
var appRoot = require('app-root-path');
let router = express.Router();
// upload file post
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null,appRoot + "/src/public/img/");
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
const upload = multer({ storage: storage, fileFilter: imageFilter });

const initwebRoute = (app) =>{
    // auth
    router.get('/',authcontroller.getLoginpage);
    router.post('/check-login',authcontroller.checkLoginpage);
    router.get('/admin/user/:id',authcontroller.getAdminpage);
    router.get('/more/:id/user/:userID',authcontroller.getDetailpage);
    router.get('/admin/news-user/:id',authcontroller.getnewuser);
    router.get('/updateusers/:idadmin/user/:id',authcontroller.updateusers);
    router.get('/admin/get-post/:id',authcontroller.getpost);
    router.post('/updateusers',authcontroller.getupdateusers);
    router.get('/delete-user/:idadmin/user/:id',authcontroller.deleteuser);
    // upload file user
    router.post('/create-new-user',upload.single('profile'),homecontroller.createNewUser);
    router.post('/upload-profile-pic/:id',upload.single('profile'),homecontroller.handleuploadfile)
    //patient
    router.get('/details-doctor/:iddoctor/:iduser',homecontroller.detailsdoctor)
    // get home
    router.get('/home/:id',homecontroller.gethome);
    // get about
    router.get('/about/:id',homecontroller.getabout);
    // get doctors
    router.get('/doctors/:id',homecontroller.getdoctorpage);
    // get news
    router.get('/blog/:id',homecontroller.getnews);
    //get blog-details
    router.get('/blog-details/:id/:userid',homecontroller.blogdetails);
    // get contact
    router.get('/contact/:id',homecontroller.contact);
    // comment 
    router.post('/comment/:postid/:userid',homecontroller.comment);
    // booking
    router.post('/booking/:id',homecontroller.getbooking);
    // deatails clinic
    router.get('/details-clinics/:idclinic/:iduser',homecontroller.getdetailclinics)
    // get acp
    router.post('/acp-booking/:id/:idbooking',authcontroller.acpuser);
    router.get('/cal-booking/:id/:idbooking',authcontroller.caluser);
    // diagnostic
    router.post('/diagnostic/:idpatient/:iddoctor',authcontroller.diagnostic);
    //get register
    router.get('/register',authcontroller.getregister);
    // post register
    router.post('/registeruser',upload.single('profile'),homecontroller.register);
    // post support
    router.post('/sendsupport/:id',homecontroller.support);

    // get acp
   router.get('/admin/get-support/:id',authcontroller.getsuportpage);
    // get acp sb
    router.post('/acp-support/:idadmin/:idsupport/:status',authcontroller.acpsupport)
    // get report
    router.get('/admin/report/:id',authcontroller.report)
    return app.use('/',router);
}
// module.exports = initwebRoute;
export default initwebRoute;