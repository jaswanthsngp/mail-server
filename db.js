const { Client } = require('pg');
const dotenv = require('dotenv')
dotenv.config();

let client = null;

const connectDB = async () => {
    try {
        client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: process.env.PGPORT
        });
        await client.connect();
        console.log((await client.query("SELECT 'Connection Eshtablished'")).rows);
    } catch(error) {
        console.error(error);
    }
}

connectDB();

const signUp = async (name, pwd, email) => {
    let x = await client.query({
        text: "insert into users(name, pwd, mailId) values($1, $2, $3) returning token",
        values: [name, pwd, email]
    });
    console.log(x.rows[0]['token']);
    return x.rows[0]['token'];
}

const login = async (email, pwd) => {
    let x = await client.query(`select validate_login('${email}', '${pwd}')`);
    return x.rows[0]['validate_login'];
}

const validateToken = async (token) => {
    let x = await client.query(`select validate_token(${token})`);
    return x.rows[0]['validate_token'];
}

const fetchMails = async (token) => {
    if(!validateToken(token)) {
        return null;
    }
    let id = await client.query(`select id from users where token=${token}`).rows[0]['id'];
    let x = await client.query(`select id, subject, sender from mails where id in (select mail from recieved where user=${id})`);
    return x.rows;
}

const mailDetails = async (mail) => {
    let x = await client.query(`select * from mails where id=${mail}`);
    return x.rows;
}

const addMail = async (subject, body, sender, reciever, cc, bcc) => {
    if(cc==="") cc = null;
    if(bcc==="") bcc = null;
    let x = await client.query({
        text: 'insert into mails values(subject, body, sender, reciever, cc, bcc) values($1, $2, $3, $4, $5, $6) returning id',
        values: [subject, body, sender, reciever, cc, bcc]
    }).rows[0]['id'];
    if(x===null)
        return false;
    await client.query(`insert into recieved values(${reciever}, ${x})`);
    if(cc!==null)
        await client.query(`insert into recieved values(${cc}, ${x})`);
    if(cc!==null)
        await client.query(`insert into recieved values(${bcc}, ${x})`);
    return true;
}

const deleteMail = async (token, mail) => {
    let uid = await client.query(`select id from users where token=${token}`);
    await client.query(`delete from recieved where user_id=${uid}, mail_id=${mail}`);
    return true;
}

export default {connectDB, signUp, login, validateToken, fetchMails, mailDetails, addMail, deleteMail}
