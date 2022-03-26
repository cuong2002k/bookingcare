import pool from '../config/connectDB'
import multer from 'multer'
let getLoginpage = (req,res) =>{
    return res.render('auth/login.ejs');
}
let checkLoginpage = async (req,res) =>{
    let {Username,Password,remember} = req.body;
    let [rows,fields] = await pool.execute('select * from users where Email = ? and Password = ?',[Username,Password]);
    
    let [doctor] = await pool.execute(`select * from users inner join roles on users.Position = roles.rolesid
                                        inner join specialized on users.specialized =  specialized.idsp 
                                        inner join clinics on users.clinics = clinics.idclinics
                                        where users.Position = 2`);
    if(rows==""){
        return res.redirect('/'); 
    }
    else{
        let [post] = await pool.execute('SELECT *   FROM `posts` INNER JOIN `users` WHERE id = idadmin');
        let [clinics,fielsdscilincs] = await pool.execute('select * from clinics');
        return res.render('Home.ejs',{datauser: rows[0],post : post,doctor : doctor , clinics: clinics});
    }
}

let getDetailpage = async (req,res) =>{
    let userid = req.params.userID;
    let idadmin = req.params.id;
    let [user,fields] = await pool.execute(`select * from (users inner join roles on users.Position = roles.rolesid) 
        inner join specialized on users.specialized =  specialized.idsp 
        inner join clinics on users.clinics = clinics.idclinics
        where id = ?`,[userid]);
                                             
    let [admin,fieldnameadmin] = await pool.execute('select * from users where id = ?',[idadmin]);
    let [specialized] = await pool.execute('select * from specialized');
    return res.render('admin/detailsuser.ejs', {datauser: user[0],admin : admin[0],specialized : specialized});
}

let getAdminpage = async (req, res) => {
    let id = req.params.id;
    const [user,fielduser] = await pool.execute('select * from users where id = ? ', [id]);
    if(user[0].Position == 1){
        const [rows, fields] = await pool.execute('SELECT * FROM users inner join roles on users.Position = roles.rolesid');
        return res.render('admin/user.ejs', { datauser: rows , userid : user[0]});
    }
    else if(user[0].Position == 2) {
        return res.send('doctor');
    }
    else{
        return res.send('patient');
    }

}
let getnewuser = async (req,res) =>{
    let id = req.params.id; 
    const [rows,fieldname] = await pool.execute('select * from users where id = ? ',[id]);
    const [specialized] = await pool.execute('select * from specialized');
    const [clinic] = await pool.execute('select * from clinics');
    return res.render('admin/createuser.ejs',{userid : rows[0] , specialized : specialized , clinic : clinic});
}

let getpost = async (req,res) =>{
    let id = req.params.id;
    const [rows,fieldname] = await pool.execute('select * from users where id = ? ',[id]);
    const [post] = await pool.execute('select * from posts');
    return res.render('admin/post',{userid : rows[0] , post : post});
}

let updateusers = async (req,res)=>{
    let userid = req.params.id;
    let id = req.params.idadmin;
    let [user,fields] = await pool.execute(`select * from (users inner join roles on users.Position = roles.rolesid) 
        inner join specialized on users.specialized =  specialized.idsp 
        inner join clinics on users.clinics = clinics.idclinics
        where id = ?`,[userid]);
    let [specialized,fieldssp] = await pool.execute('select * from specialized');
    let [clinic] = await pool.execute('select * from clinics');
    let [idadmin] = await pool.execute(`SELECT * FROM users  where id = ?`,[id]);
    return res.render('admin/editusers.ejs',{datauser: user[0],admin : idadmin[0],specialized : specialized , clinic : clinic});
}

let getupdateusers = async (req,res)=>{
    let {FullName,
        MobileNumber,
        Password,
        Sex,
        birthday,
        Address,
        Email,
        Position,
        id,
        adminid,
        clinics,
        specialized
    } = req.body;
    
    await pool.execute(`update users set FullName = ?,
                        MobileNumber = ?,
                        Password  =? ,
                        Sex =? ,
                        birthday =? ,
                        Address =? ,
                        Email =? ,
                        Position =?,
                        clinics = ?,
                        specialized = ?
                        where id = ?`,                
    [FullName,MobileNumber,Password,Sex,birthday,Address,Email,Position,clinics,specialized,id]);
    const [admin] = await pool.execute('select * from users where id = ?',[adminid]);

    return res.render('admin/successful.ejs',{admin : admin[0]});
}
let deleteuser = async (req,res) =>{
    let userid = req.params.id;
    let idadmin = req.params.idadmin;
    await pool.execute('delete from users where id = ?',[userid]);
    const [admin] = await pool.execute('select * from users where id = ? ', [idadmin]);
    return res.render('admin/successful.ejs' , {admin : admin[0]});
    
    // return res.redirect('/');  
}
module.exports = {
    getLoginpage,
    checkLoginpage,
    getAdminpage,
    getnewuser,
    getpost,
    getDetailpage,
    updateusers,
    getupdateusers,
    deleteuser
}