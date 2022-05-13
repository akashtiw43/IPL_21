const request=require("request");
const cheerio=require("cheerio");
const scObj=require("./scoreCard");
function allMatch(url){
    request(url,cb);
    function cb(err,response,html){
        if(err){

        }else{
            viewRes(html);
        }
    }
}
function viewRes(html){
    let $=cheerio.load(html);
    let matchesArr=$("a[data-hover='Scorecard']");
    for(let i=0;i<matchesArr.length;i++){
    
       let href=$(matchesArr[i]).attr("href");
       let fullLink="https://www.espncricinfo.com"+href;
       console.log(fullLink);
       scObj.sc(fullLink);
    }
}

module.exports={
    gAM : allMatch
}