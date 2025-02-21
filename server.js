const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set("view engine", "ejs");
app.use(express.static("public"));

const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true,
});

app.use("/peerjs", peerServer);

var nodeMailer=require("nodemailer")
const transporter=nodeMailer.createTransport({
    port:465,
    host:"smtp.gmail.com",
    auth:{
        user:"studenttrialwhitehat@gmail.com",
        pass:"nnaxgptjwtuffwoz"
    },
    secure:true
})

app.get("/", (req, res) => {
    res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
    res.render("index", { roomId: req.params.room });
});

app.post("/send-mail",(req,res)=>{
    const to2=req.body.to
    const url=req.body.url
    const mailData={
        from:"studenttrialwhitehat@gmail.com",
        to:to2,
        subject:"📽🎤☠",
        html:`<p>Join me, and together we shall rule the Galaxy! ${url}</p>`
    }
    transporter.sendMail(mailData,(error,info)=>{
        if(error){
            return console.log(error)
        }
        res.status(200).send({
            message:"Invitation has been sent",
            message_id:info.messageId
        })
    })
})

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
        socket.join(roomId);
        io.to(roomId).emit("user-connected", userId);
        socket.on("message", (message) => {
            io.to(roomId).emit("createMessage", message, userName);
        });
    });
});

server.listen(process.env.PORT || 3030);
