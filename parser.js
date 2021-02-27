'use strict';


// var gutil = require('gulp-util');
// var through = require('through2');
// var path = require('path');
// var fs = require('fs');
// var http = require('http');
// var https = require('https');

import gutil from "gulp-util";
import through from "through2";

import path from "path";
// import http from "http";
import fs from "fs";
// import https from 'https';

// import request from "request";
import request from "sync-request";
// import axios from "axios";
// const axios = require('axios').default;

import { formatData } from "./options.js";
import fontsDownload from './downoader.js';

const __dirname = path.resolve(path.dirname(''));


//@ts-ignore
/**
 * 
 * options:
 * - lang: 'cyrillic'|'latin'|'vietnamese'|'cyrillic-ext'|'latin-ext'|Any
 * - format: 'ttf'|'wwof'|'wwof2'|'svg'|'eof'
 * - log: boolean
 * - static_url: Path? = '/static/'     // - path to fonts saving
 * 
 * @param {*} options
 */
export default function fontParser(options) {

    // Какие-то действия с опциями. Например, проверка их существования,
    // задание значения по умолчанию и т.д.
    // options = {release : true}
    return through.obj(function (file, enc, cb) {
        // Если файл не существует
        if (file.isNull()) {
            cb(null, file);
            return;
        }
        // Если файл представлен потоком
        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-import', 'Streaming not supported'));
            return;
        }
        try {
            var execpath = path.dirname(file.path);

            options = options || {
                static_url: '/static/',
                format: 'woff2'
            }
            var data = file.contents.toString();

            // на вход принимаеи цсс с импортами

            // 1 ищем 

            const baseUrl = 'https://fonts.googleapis.com';
            console.log('')

            data = data.replace(/^\@import url\('https:\/\/fonts\.googleapis\.com(?<url_path>\/.*?)'\);?/gm, function (_, urlpath) {

                if (typeof urlpath === typeof '') {

                    console.log(`get fonts from url: ${baseUrl + urlpath}`);

                    // let urlOptions = {
                    //     host: baseUrl,
                    //     port: 443,
                    //     path: urlpath
                    // }

                    // let getFonts = async () => new Promise((resolve, reject) => https.get(urlOptions, function (res) {

                    //         // res.on('data', chunk => { data += chunk })
                    //         // res.on('end', () => {
                    //         //     console.log(data);
                    //         // })
                                
                    //         console.log("Got response: " + res.statusCode);
                    //         resolve('res')
                    //         // return res

                    //     }).on('error', function (e) {

                    //         console.log("Got error: " + e.message);
                    //         // return e
                    //         resolve('e')
                    //     })
                    // );

                    // let fonts = await fetch(baseUrl + urlpath).then(r => r.ok ? r.text() : '')
                    
                    // let fonts = await getFonts();
                    // console.log(fonts)

                    // let fonts = await axios.get(baseUrl + urlpath);

                    let fonts = request('GET', baseUrl + urlpath, {
                        headers: {
                            'user-agent': formatData[options['format'] || 'woff2'].agent
                        }                        
                    })
                    
                    let fontsStyle = fonts.body.toString()

                    options['log'] && console.log(`replaced to ===> ${_}`)                    

                    let lang = options['lang'];
                    
                    if (lang) {

                        let re = new RegExp(`\/\\* ${lang} \\*\/[\n\r]{1,2}(?<font>@font-face[\\s\\S]*?})`, 'gm');                        
                        let matches = fontsStyle.match(re)
                        if (matches) {
                            //@ts-ignore
                            fontsStyle = matches.reduce((styles, font) => styles + '\n' + font);
                            
                        }
                        else {
                            console.log(re)
                            console.log(matches)
                            console.log(fontsStyle)
                        }
                    }

                    // console.log(fontsStyle)

                    let fontsStyles = fontsDownload(fontsStyle, options, formatData[options['format'] || 'woff2'].agent);

                    // console.log(fontsStyles)
                    console.log('')
                    
                    return fontsStyles;
                }

                return _;
            })

            fs.writeFileSync('sample.less', data)

            //@ts-ignore
            file.contents = Buffer.from(data);
            this.push(file);
        }
        catch (err) {
            this.emit('error', new gutil.PluginError('gulp-import', err));
            console.log(err)
        }
        cb();
    });
}


// // dnt w f require. W_?
// const module = globalThis['module'] || {}
// module.exports = fontGetter;