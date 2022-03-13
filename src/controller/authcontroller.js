import pool from '../config/connectDB'
let getLoginpage = (req,res) =>{
    return res.render('auth/login.ejs');
}
let checkLoginpage = async (req,res) =>{
    let {Username,Password,remember} = req.body;
    let [rows,fields] = await pool.execute('select * from users where Email = ? and Password = ?',[Username,Password]);
    console.log(rows);
    if(rows==""){
        return res.redirect('/'); 
    }
    else{
        let [post] = await pool.execute('SELECT *   FROM `posts` INNER JOIN `users` WHERE id = idadmin');
        return res.render('Home.ejs',{datauser: rows[0],post : post});
    }
}
module.exports = {
    getLoginpage,
    checkLoginpage,
}