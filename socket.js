const express = require('express');
const { createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');
const driver = require('sqlite3').Database;
const open = require('sqlite').open;

async function main(){
    const db = await open({
        filename:'messages',
        driver:driver
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            client_offset TEXT UNIQUE,
            content TEXT
        );
      `);
    

const app = express();
const port = 3000;
const server = createServer(app);
const io = new Server(server,{
    connectionStateRecovery:{}
  });

io.on('connection', (socket) => {
   io.emit('chat message', 'Hi There!');

    socket.on('chat message', async(msg) => {
        let result;
        try{
            result = await db.run('INSERT INTO messages (content) VALUES (?)',msg);
        }catch(e){
            console.log(e);
        }
        console.log('message: ' + msg + ' result ' + result.changes);
        io.emit('chat message', msg, result.lastID);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    if (!socket.recovered) {
        //if the socket is not recovered, it means it is a new connection
        
        try {
            db.each('SELECT id, content FROM messages WHERE client_offset > ?',[socket.handshake.auth.serverOffset || 0],(err,row)=>{
                if(err){
                    console.log( "error during recovery" , err);
                    return;
                }
                socket.emit('chat message', row.content, row.id);
            })
            
        } catch (error) {
            console.log(error);
            
        }
        socket.emit('chat message', 'Chat history recovered');
        
    }

});

app.use(express.json());

app.get('/', (_req, res) => {
    const fileName = 'index.html';
    res.sendFile(path.join(__dirname, `./view/${fileName}`));
});

server.listen(port, () => console.log(`listening to ${port}`));

}

main();