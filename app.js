var ir;
var tcpPort = 5002;
var socketPort = 4000;
var sockets = [];
var test = [];
test.push('value1');

var iRacing = require('iRacing').iRacing;
var net = require('net');
var server = null;

//    return iRacing.ready(function() {
//        //socket.emit('ready', true);
//        //socket.emit('weekend', this.sessions.weekend);
//        //socket.emit('session', this.sessions.current);
//        //socket.emit('driver', this.cars.driverCar);
//
//        var Throttle;
//        this.onTick(function () {
//            var _Throttle = this.getTelemetry('Throttle');
//            if (_Throttle !== Throttle) {
//                Throttle = _Throttle;
//                console.log(Throttle);
//                socket.write('Throttle: ' + Throttle.toString());
//            }
//        })
//    });
//});

var server = net.createServer(function(socket) { //'connection' listener
    console.log('server connected');
    socket.on('end', function() {
        console.log('server disconnected');
    });
    socket.write('hello\r\n');
    socket.pipe(socket);

    sockets.push(socket);
    test.push('value2');
    console.log('Server Socket Store Lenght: ', sockets.length);
    console.log('Server Test store Length: ', test.length);

    socket.on('close', function() {
        console.log('Connection Closed');
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
    });

    socket.on('error', function(err) {
        console.log('Socket Error: ', err.message);
    })

    iRacing.ready(function() {
        console.log('Connected to iRacing\n');
        console.log(this.sessions.weekend.TrackDisplayName);

        var throttle;
        this.onTick(function() {
            var _throttle = this.getTelemetry('Throttle');
            if(_throttle !== throttle) {
                throttle = _throttle;
                console.log('Received Value - Throttle: ', throttle);
                socket.emit( JSON.stringify({
                    'Track' : this.sessions.weekend.TrackDisplayName,
                    'Driver' : 'test driver',
                    'Throttle' : throttle
                }));
            }
        })
    });
});
server.listen(tcpPort, function() { //'listening' listener
    console.log('server bound');
});

var setupiRacingConnection = function () {
    console.log('Waiting for Connection from iRacing\n');
    console.log("Press Ctrl+C to quit");
    iRacing.ready(function() {
        console.log('Connected to iRacing\n');
        console.log(this.sessions.weekend.TrackDisplayName);

        server = net.createServer();

        server.on('error', function(err) {
            console.log('Server error:', err.message);
        });

        server.on('close', function() {
            console.log('Server Closed');
        });

        server.on('connection', function(socket) {
            console.log('got a new connection\n');
            sockets.push(socket);
            test.push('value2');
            console.log('Server Socket Store Lenght: ', sockets.length);
            console.log('Server Test store Length: ', test.length);

            socket.on('close', function() {
                console.log('Connection Closed');
                var index = sockets.indexOf(socket);
                sockets.splice(index, 1);
            });

            socket.on('error', function(err) {
                console.log('Socket Error: ', err.message);
            })
        });
        server.listen(tcpPort);

        var throttle;
        this.onTick(function() {
            var _throttle = this.getTelemetry('Throttle');
            if(_throttle !== throttle) {
                throttle = _throttle;
                console.log('Received Value - Throttle: ', throttle);
                emit('Throttle', throttle);
            }
        })
    });

};

var emit = function (telemetryCode, val) {
    console.log('socket length: ', sockets.length);
    if(sockets.length > 0 && server) {
        for(i in sockets) {
            sockets[i].write(telemetryCode + " : " + val);
        }
    }
}

console.log('Setting up iRacing Connection');
//setupiRacingConnection();