const app = require('express')();
let bodyParser= require('body-parser');
const db = require('./db').default;
require('dotenv').config();

app.use('/', (req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.use('/', (req, res, next) => {
    if(!validateToken(req.body.token)) {
        res.status(403);
        res.send({message: "Session Expired, please login again"});
        return;
    }
    next();
});

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.send('Hello World');
});

// login form
app.post('/login', async (req, res) => {
    // email, pwd
    let x = await db.login(req.body.email, req.body.pwd);
    if(x===null) {
        res.json({success: false});
        return;
    }
    res.json({success: true, token: x})
});

// signup form
app.post('/signup', async (req, res) => {
    // name, pwd, email
    let x = await db.login(req.body.name, req.body.pwd, req.body.email);
    if(x===null) {
        res.json({success: false});
        return;
    }
    res.json({success: true, token: x});
});

// get all mails of particular user
app.get('/mails', async(req, res) => {
    let x = await db.fetchMails(req.body.token);
    if(x===null) {
        res.json({success: false});
        return;
    }
    res.json({success: true, mails: x});
});

// get all details of particular mail
app.get('/mailDetail', async(req, res) => {
    let x = await db.mailDetails(req.body.mailId);
    if(x===null) {
        res.json({success: false});
    }
    res.json({success: true, mail: x});
});

// create a new mail
app.post('/newMail', async (req, res) => {
    let x = await db.addMail(req.body.subject, req.body.body, req.body.sender, req.body.reciever, req.body.cc, req.body.bcc);
    return res.json({success: x});
});

// delete a mail
app.post('/deleteMail', async(req, res) => {
    await db.deleteMail(req.body.token, req.body.mail);
    return res.json({success: x});
})

// launch server
app.listen(process.env.PORT, () => {
    console.log(`Server online on ${process.env.PORT}`);
});
