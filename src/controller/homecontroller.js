
import pool from '../config/connectDB'
// chứa các logic trước khi vào trang
import multer from 'multer'
// admin
let getHomepage = async (req, res) => {
    
    const [rows, fields] = await pool.execute('SELECT * FROM `users`');
    return res.render('admin/index.ejs', { datauser: rows });
}

let getDetailpage = async (req,res) =>{
    let userid = req.params.userID;
    let [user,fields] = await pool.execute(`select * from users where id = ?`,[userid]);
    return res.render('admin/detailsuser.ejs', {datauser: user[0]});
}
let getnewuser = (req,res) =>{
    return res.render('admin/createuser.ejs')
}
let createNewUser = async (req,res) =>{
    let {Name ,
        Surname ,
        MobileNumber ,
        Password,
        Sex,
        birthday,
        IdCard,
        Address,
        Email,
        Job,
        Position,
        Country,
        State
    } = req.body;
    await pool.execute(`insert into users(
        Name,SurName,MobileNumber,Password,Sex,BirthDay,IDcard,Address,Email,Job,Position,Country,State) values(?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [Name,Surname,MobileNumber,Password,Sex,birthday,IdCard,Address,Email,Job,Position, Country, State]);
    console.log(req.body);
    return res.redirect('/');
}
let deleteuser = async (req,res) =>{
    let userid = req.body.userID;
    await pool.execute('delete from users where id = ?',[userid]);
    return res.redirect('/');  
}
let updateusers = async (req,res)=>{
    let userid = req.params.id;
    let [user] = await pool.execute(`select * from users where id = ?`,[userid]);
    return res.render('admin/editusers.ejs',{datauser: user[0]})
}
let getDoctor = async (req,res)=>{
    let Doctor = req.body.Doctor;
    const [rows, fields] = await pool.execute('SELECT * FROM `users` where Position = ?',[Doctor]);
    return res.render('admin/index.ejs',{datauser: rows})
}
let getPatient = async (req,res)=>{
    let Doctor = req.body.Patient;
    const [rows, fields] = await pool.execute('SELECT * FROM `users` where Position = ?',[Doctor]);
    return res.render('admin/index.ejs',{datauser: rows})
}
let getAdmin = async (req,res)=>{
    let Doctor = req.body.Admin;
    const [rows, fields] = await pool.execute('SELECT * FROM `users` where Position = ?',[Doctor]);
    return res.render('admin/index.ejs',{datauser: rows});
}

// let getupdateusers = async (req,res)=>{
//     let {firstName,lastName,email,address,id} = req.body;
//     await pool.execute(`update users set firstName = ?, lastName = ?, email = ?, address = ? where id = ?` ,
//     [firstName,lastName,email,address,id]);
//     return res.redirect('/');  
// }
let getpost = (req,res) =>{
    return res.render('admin/post');
}
//upload file
const upload = multer().single('profile_pic');
let handleuploadfile = async (req,res) =>{
    const name = req.body.name;
    const content = req.body.content;
    const file = req.file.filename;
    upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        // Display uploaded image for user validation
        
        res.send(`You have uploaded this image: <hr/><img src="/img/post/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`);

    });
}
// patients
// get home
let gethome = async (req,res)=>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id])
    let [post] = await pool.execute('SELECT *   FROM `posts` INNER JOIN `users` WHERE id = idadmin');
    let [users,fieldsuser] = await pool.execute('select * from users where Position = 2');
    return res.render('Home.ejs',{datauser: rows[0],post: post,doctor : users});
    // return res.send('hello');
}
// get about
let getabout = async (req,res)=>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id])
    return res.render('about.ejs',{datauser: rows[0]})
}
// get getdoctordetails
let getdoctorpage = async (req,res) =>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id]);
    const [doctor, fieldsdoctor] = await pool.execute('select * from users where Position = 2');
    return res.render('doctors.ejs',{datauser: rows[0],doctor : doctor});
}
// get getnews
let getnews = async (req,res)=>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id]);
    const [post,postfields] = await pool.execute('SELECT *   FROM `posts` INNER JOIN `users` WHERE id = idadmin');
    return res.render('blog.ejs',{datauser: rows[0],post : post});
}
let blogdetails = async (req,res)=>{
    let postid = req.params.id;
    let id = req.params.userid;
    
    const [rows, fields] = await pool.execute('select * from posts where idpost = ?',[postid]);
    const [user, fieldsuser] = await pool.execute('select * from users where id = ?',[id]);
    return res.render('blog-details.ejs',{post: rows[0],datauser: user[0]});
}
let contact = async (req,res) =>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id])
    return res.render('contact.ejs',{datauser: rows[0]});
}
module.exports = {
    getHomepage,
    getDetailpage,
    getnewuser,
    createNewUser,
    deleteuser,
    updateusers,
    getDoctor,
    getPatient,
    getAdmin,
    gethome,
    getabout,
    getdoctorpage,
    getnews,
    blogdetails,
    contact,
    getpost,
    handleuploadfile,
    
    // getupdateusers
}