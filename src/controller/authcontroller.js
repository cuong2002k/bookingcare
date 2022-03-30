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
    const [user,fielduser] = await pool.execute('select * from users where id = ?', [id]);
    const [doctor] = await pool.execute(`select * from booking  
                                        inner join users on booking.iddoctor = users.id
                                        inner join specialized on users.specialized =  specialized.idsp 
                                        inner join clinics on users.clinics = clinics.idclinics `);
                                        
    const [booking] = await pool.execute(`select * from booking  inner join users on booking.idpatient = users.id`);
    const [booking1] = await pool.execute(`select * from booking  inner join users on booking.idpatient = users.id where iddoctor = ? `,[id]);
    
    if(user[0].Position == 1){
        const [rows, fields] = await pool.execute('SELECT * FROM users inner join roles on users.Position = roles.rolesid');
        return res.render('admin/user.ejs', { datauser: rows , userid : user[0]});
    }
    else if(user[0].Position == 2) {
        const [doctor1] = await pool.execute(`select * from booking  
                                        inner join users on booking.iddoctor = users.id
                                        inner join specialized on users.specialized =  specialized.idsp 
                                        inner join clinics on users.clinics = clinics.idclinics 
                                        `);
        const [diagnostic] = await pool.execute('select * from diagnostic where diagnostic.iddoctor = ?',[id]);
        return res.render('doctor/manage.ejs',{userid : user[0] , booking : booking1 , doctor : doctor1, diagnostic : diagnostic});
    }
    else if(user[0].Position == 3){
        
        return res.render('supporter/manage.ejs',{userid : user[0] , booking : booking , doctor : doctor});
    }
    else{
        const [doctor123] = await pool.execute(`
        select * from booking 
        inner join users on booking.iddoctor = users.id 
        inner join specialized on users.specialized =  specialized.idsp 
        inner join clinics on users.clinics = clinics.idclinics 
        where booking.idpatient = ?
        `,[id]);  
         
                                    
        const [patientt] = await pool.execute(`select * from booking  
                            inner join users on booking.idpatient = users.id 
                            where idpatient = ? ` ,[id]); 
        const [fieldname] = await pool.execute('select * from diagnostic where diagnostic.idpatient = ?',[id]); 
        
        return res.render('patient/managepatient.ejs',{userid : user[0] , booking : patientt , doctor : doctor123, diag : fieldname});
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
let acpuser = async (req,res) =>{
    let idpatient = req.params.id;
    let idbooking = req.params.idbooking;
    await pool.execute('update booking set status = 2 where idbooking = ?',[idbooking]);
    return res.redirect(`/admin/user/${idpatient}`);
}
let caluser = async (req,res) =>{
    let idpatient = req.params.id;
    let idbooking = req.params.idbooking;
    await pool.execute('update booking set status = 3 where idbooking = ?',[idbooking]);
    return res.redirect(`/admin/user/${idpatient}`);
}
let diagnostic = async (req,res) =>{
    let iddoctor = req.params.iddoctor;
    let idpatient = req.params.idpatient;
    let {diagnostic,
        stage,
        note,
        bookingid} = req.body;
    console.log(req.body);
    await pool.execute(`update booking set status = 4 where idbooking = ?`, [bookingid]);
    await pool.execute(`insert into diagnostic(id,iddoctor,idpatient,diagnostic,stage,note) values(?,?,?,?,?,?)`,[
        bookingid,
        iddoctor,
        idpatient,
        diagnostic,
        stage,
        note]);
    return res.redirect(`/admin/user/${iddoctor}`);
    
}
let getregister = async (req, res) =>{
    const [specialized] = await pool.execute('select * from specialized');
    const [clinic] = await pool.execute('select * from clinics');
    return res.render('auth/register.ejs',{specialized : specialized, clinic : clinic});
}
let getsuportpage = async (req,res) =>{
    let id = req.params.id;
    const [userid] = await pool.execute('select * from users where id = ?',[id]);
    const [support] = await pool.execute('select * from support');
    return res.render('supporter/support.ejs',{userid : userid[0] , support : support})
}
let acpsupport = async (req,res) =>{
    let iduser = req.params.idadmin;
    let idsupport = req.params.idsupport;
    let status = req.params.status;
    await pool.execute('update support set status = ? where idsupport = ?',[status,idsupport]);
    // const [userid] = await pool.execute('select * from users where id = ?',[iduser]);
    return res.redirect(`/admin/get-support/${iduser}`);
}
let report = async (req,res) =>{
    let id = req.params.id;
    const [userid] = await pool.execute('select * from users where id = ?',[id]);
    return res.render('doctor/report.ejs',{userid : userid[0]})
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
    deleteuser,
    acpuser,
    caluser,
    diagnostic,
    getregister,
    getsuportpage,
    acpsupport,
    report
   
}