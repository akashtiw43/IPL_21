const request=require("request");
const cheerio=require("cheerio");
const fs=require("fs");
const path=require("path");

const gAMobj = require("./Allmatch");
const iplPath=path.join(__dirname,"ipl");
dirCreator(iplPath);
const url="https://www.espncricinfo.com/series/ipl-2021-1249214";
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log("err");
    }else{
        extractHtml(html);
    }
}
function extractHtml(html){
    let $=cheerio.load(html);
    let allRes=$(".widget-items.cta-link").find("a").attr("href");
    let fullLink="https://www.espncricinfo.com"+allRes;
    gAMobj.gAM(fullLink);
}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

