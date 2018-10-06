var fs = require('fs');
var express = require('express');
var app = express();
const config = require('./config.json');
const fileName = './data.json';
const data = require(fileName);
const PORT = config.PORT;

var server = app.listen(PORT, ()=>{
    console.log(`listening on :${PORT}`);
});

var io = require('socket.io')(server);

app.use('/static', express.static('public'))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket)=>{
    console.log('a user is connected');
    socket.on('disconnect',()=>{
        console.log('user disconnect');
    });

    socket.on('selected', (key)=>{
        console.log(key);
        validation(key, (err)=>{
            if(!err){
                console.log(`success`);
                updateData(key, err=>{
                    if (err) return console.log(err);
                    updateFile(data, fileName, (err)=>{
                        if (err) return console.log(err);
                        io.emit('selected', key);
                        return console.log('congo!');
                    });
                });
            }else{
               return console.log(err);
            }
        })
    });

    io.emit('initialData', data.plots);
});

function validation(key, cb){
    console.log(!data);
    if (!data.plots || !data.start || !data.end) return cb('missing property');
    if(data.start<=key && key <= data.end){
        return cb(null);
    }else{
        return cb('out of range');
    }
};

function updateData(key, cb){
    if(data.plots.indexOf(key) >= 0){
        return cb('already booked');
    }else{
        data.plots.push(key);
        return cb(null);
    }
};

function updateFile(data, filename, cb){
    fs.writeFile(filename, JSON.stringify(data), (err)=>{
        if(err) return cb(err);
        console.log('data updated!');
        console.log(JSON.stringify(data));
        return cb(null)
    });
}