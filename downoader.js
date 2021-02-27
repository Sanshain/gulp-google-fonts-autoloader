import path from "path";
import fs from "fs";
// import http from "http";
// import https from "https";

// const { exec } = require("child_process");
import { exec } from "child_process";

const __dirname = path.resolve(path.dirname(''));
const targetDir = 'fonts';


//@ts-ignore
export default function fontsDownload(data, options, agent) {

    // console.log(data)

    return data.replace(/src: url\((?<urlpath>http.*?\.(ttf|woff|woff2))\)/g, function (_, url) {
        if (typeof url === typeof '') {

            // console.log('---')
            // console.log(_)
            // console.log('+++')

            let fontName = url.split('/').slice(-1)[0];
            let relUrl = (options.static_url || '/static/') + 'fonts/' + fontName;   
            let fileName = path.resolve(__dirname, targetDir, fontName);

            console.log(`url from: ${url}`)
            console.log(`save url: ${relUrl}`)
            console.log(`save file: ${fileName}`)

            // let urlName = url.replace('http://', '').replace('https://', '')
            // let host = urlName.split('/')[0]
            // let urlpath = urlName.replace(host, '')

            // let urlOptions = {
            //     host: host,
            //     port: 443,
            //     path: urlpath,
            //     headers: {                  
            //         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' // agent
            //     }
            // }

            console.log(url)

            if (!fs.existsSync(fileName)) {
                // const file = fs.createWriteStream(fileName);
                // const request = https.get(urlOptions, function (response) {                    
                //     response.pipe(file);
                // });
                exec(`wget ${url} -P ${targetDir}`)
            }

            return _.replace(url, relUrl);
        }

        return _;
    })
}

