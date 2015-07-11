/**
 * Created with JetBrains WebStorm.
 * User: allendolph
 * Date: 2/13/14
 * Time: 12:15 PM
 * To change this template use File | Settings | File Templates.
 */
var net = require('net');
var port = 5002;


process.stdin.resume();

(function connect() {
    var conn = net.createConnection(port);

    conn.on('connect', function() {
        console.log('connected to server');
    });

    conn.on('ready', function() {
        console.log('Connection to Telemetry Server is Ready');
    })
    conn.on('error', function(err) {
        console.log('Error in connection: ', err);
    });

    conn.on('info', function(info) {
        console.log(info + '\n');
    })
    conn.on('close', function() {
        console.log('connection got closed, will try to reconnect');
        connect();
    });

    conn.on('data', function(data) {
        data.setEncoding('utf8');
        data.on('data', function(chunk) {
            assert.equal(typeof chunk, 'string');
            console.log('got %d characters of string data', chunk.length);
        })
    });

    conn.pipe(process.stdout, {end: false});
    //process.stdin.pipe(conn);
}());
