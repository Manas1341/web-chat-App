const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const app = express();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

app.use(express.json());

const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Socket Connection
const server = app.listen(
  PORT,
  console.log(`Server is Running on PORT ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  }
});

io.on("connection", (socket) => {
    console.log('Connected to socket.io ')
    
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User Joined Room " +room)
    })

    socket.on('typing' , (room) => socket.in(room).emit('typing'))
    socket.on('stop typing' , (room) => socket.in(room).emit('stop typing'))

    socket.on("new message" , (newMessageRecieved)=>{
        var chat = newMessageRecieved.chat

        if(!chat.users){
            return console.log("chat.users not defined")
        }
        chat.users.forEach((user)=>{
            if(user._id === newMessageRecieved.sender._id){
                return
            }
            socket.in(user._id).emit("message Recieved" , newMessageRecieved)
        })
    })
    socket.off('setup',()=>{
        console.log('USER DISCONNECTED')
        socket.leave(userData._id) 
    })
});

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(MONGO_URL);
    console.log("Server is connected to Database");
  } catch (error) {
    console.log("Error connecting to Database", error.message);
  }
};

connectDb();

app.get("/", (req, res) => {
  res.send("API is Running1234");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);
