import http from 'http';
import { createReadStream } from 'fs';



function fetchImages(fileName, cb) {
    const imgbuff = [];

    const rStream = createReadStream(fileName);
    rStream.on('data', ch => {
        imgbuff.push(ch);
    })

    rStream.on('err', err => cb(err))
    rStream.on('end', () => {
        const buff = Buffer.concat(imgbuff);
        cb(null, buff);
    })
}

function getIndexStream(filename, cb) {
    let data = '';
    const readFile = createReadStream(filename);

    readFile.on('data', ch => {
        data += ch.toString();
    })

    readFile.on('end', () => cb(null, data));
    readFile.on('error', error => cb(error, null));
}

const server = http.createServer((req, res) => {

    if((req.method === 'GET') && req.url === '/') {
        res.writeHead(200, {
            'Content-Type' : 'text/html'
        });

        getIndexStream('index.html', (err, index) => {
            if(err) throw err;

            res.write(index);
            res.end();
        });
    }


    if((req.method === "GET") && (req.url === '/image')){
        res.writeHead(200, {
            'Content-Type' : 'application/json'
        })

        fetchImages('../img/img1.png', (err, imgBuff) => {
            if(err) throw err;

            // console.log('Img buf --> ', imgBuff.toString('base64'));

            res.write(JSON.stringify({image_source : imgBuff.toString('base64')}));
            res.end();
        })
    }
})


server.listen(4000, () => console.log('Running at port 4000'));