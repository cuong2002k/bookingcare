
import pool from '../config/connectDB'
// chứa các logic trước khi vào trang
import multer from 'multer'
import { system } from 'nodemon/lib/config';
// admin

let createNewUser = async (req,res) =>{
    var {FullName ,
        MobileNumber ,
        Password,
        Sex,
        birthday,
        Address,
        Email,
        Position,
        clinics,
        specialized,
        adminid
    } = req.body;
    upload(req, res, async function(err) {
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
        // res.send(`You have uploaded this image: <hr/><img src="/img/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`);
        await pool.execute(`insert into users(FullName,MobileNumber,Password,Sex,BirthDay,Address,Email,Position,specialized,clinics,img) values(?,?,?,?,?,?,?,?,?,?,?)`,
            [FullName,MobileNumber,Password,Sex,birthday,Address,Email,Position,specialized,clinics,req.file.filename]);
        const [admin] = await pool.execute('select * from users where id = ?',[adminid]);
        return res.render('admin/successful.ejs', {admin : admin[0]});
    }); 
    // return res.send('successful');
}


//upload file
const upload = multer().single('profile_pic');
let handleuploadfile = async (req,res) =>{
    const {name,content} = req.body;
    let idadmin = req.params.id;
    upload(req, res, async function(err) {
        
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
        await pool.execute('insert into posts(idadmin,name,content,image) values(?,?,?,?)',[idadmin,name,content,req.file.filename]);
        res.redirect(`/admin/get-post/${idadmin}`)
    });
}
// patients
// get home
let gethome = async (req,res)=>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id])
    let [post] = await pool.execute('SELECT *   FROM `posts` INNER JOIN `users` WHERE id = idadmin');
    let [users] = await pool.execute(`select * from users inner join roles on users.Position = roles.rolesid
                                        inner join specialized on users.specialized =  specialized.idsp 
                                        inner join clinics on users.clinics = clinics.idclinics
                                        where users.Position = 2`);
    let [clinics,fielsdscilincs] = await pool.execute('select * from clinics');
    return res.render('Home.ejs',{datauser: rows[0], post: post, doctor : users , clinics : clinics});
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
    const [comment,fieldscomment] = await pool.execute('select * from comment inner join users on idpatient = id where idnews = ? ',[postid]);
    return res.render('blog-details.ejs',{post: rows[0],datauser: user[0],comment : comment});
}
let contact = async (req,res) =>{
    let id = req.params.id;
    const [rows, fields] = await pool.execute('select * from users where id = ?',[id])
    return res.render('contact.ejs',{datauser: rows[0]});
}

let comment = async (req,res) =>{
    let idnew = req.params.postid;
    let idpatient = req.params.userid;
    let comment = req.body.msg;
    let date = new Date();
    await pool.execute('insert into comment values(?,?,?,?)',[idnew,idpatient,comment,date]);
    return res.redirect(`/blog-details/${idnew}/${idpatient}`); 
}
let detailsdoctor = async (req,res) =>{
    let iduser = req.params.iduser;
    let iddoctor = req.params.iddoctor;
    const [user] = await pool.execute('select * from users where id = ?', [iduser]);
    let [doctor,fields] = await pool.execute(`select * from (users inner join roles on users.Position = roles.rolesid) 
        inner join specialized on users.specialized =  specialized.idsp 
        inner join clinics on users.clinics = clinics.idclinics
        where id = ?`,[iddoctor]);
    
    return res.render('detailsdoctor.ejs',{user : user[0],doctor: doctor[0]});
}
let getbooking = async (req,res) =>{
    let {doctor,
    patient,
    Time,
    Date,
    reason} = req.body;
    await pool.execute('insert into booking(iddoctor,reason,idpatient,time,date) values(?,?,?,?,?)',[doctor,reason,patient,Time,Date]);

    return res.send('thanh cong');
}
let getdetailclinics = async (req,res) =>{
    let userid = req.params.iduser;
    let idclinic = req.params.idclinic;
    const [user] = await pool.execute('select * from users where id = ?' , [userid]);
    const [clinic] = await pool.execute('select * from clinics where idclinics = ?',[idclinic]);
    const [doctor] = await pool.execute('select * from users inner join specialized on users.specialized =  specialized.idsp where clinics = ? ' , [idclinic]);
    return res.render('detailsclinic.ejs',{user : user[0],clinic : clinic[0],doctor : doctor});
}
module.exports = {
    createNewUser,
    gethome,
    getabout,
    getdoctorpage,
    getnews,
    blogdetails,
    contact,
    handleuploadfile,
    comment,
    detailsdoctor,
    getbooking,
    getdetailclinics
}