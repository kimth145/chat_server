const express = require('express')
const app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http, {cors:{origin:"*"}})

let userInfo = []

io.on('connection', (socket)=>{
    console.log("user connected!!")

    socket.on('disconnect', ()=>{
        const user = userInfo.find(c=>c.id == socket.id)
        if(user){
            socket.broadcast.emit('msg',{level:"sys" ,msg:user.nickName+" 님이 퇴장하였습니다", nickName:""})
        }
    })

    socket.on('login', (nickName)=>{
        const info = {
            nickName:nickName,
            id:socket.id
        }
        userInfo.push(info)
        io.emit('msg',{level:"sys" ,msg:nickName+" 님이 입장하였습니다",nickName:""})
    })

    socket.on('send', ({nickName:nickName, msg:msg})=>{
        socket.broadcast.emit('msg',{level:"" ,msg:msg, nickName:nickName})
    })

})

http.listen(process.env.PORT || 5000, ()=>{
    console.log("connected!!!")
})