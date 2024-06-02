import MessageManager from "../dao/managers/mongomanagers/messageManager.js"

const messageManager = new MessageManager()

const socketChat = (socketServer) => {

    socketServer.on('connection', async socket => {

        socketServer.emit("messageLogs", await messageManager.getMessages())

        socket.on("message", async data => {
            await messageManager.createMessage(data)
            socketServer.emit("messageLogs", await messageManager.getMessages())
        })
    })
}

export default socketChat