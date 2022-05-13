const request=require("request");
const cheerio=require("cheerio");
const { builtinModules } = require("module");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");

function scoreCard(url){
    request(url,cb);
}
function cb(err,respone,html){
    if(err)
    {}
    else{
        extractScorecard(html);
    }
}
function extractScorecard(html){
    let $=cheerio.load(html);
    let desc=$(".description");
    let venue=$(desc[0]).text().split(",")[1];
    let date=$(desc[0]).text().split(",")[2];
    let result=$(".event .status-text").text();
    let innings=$(".card>.Collapsible");
    //let htmlString="";
    for(let i=0;i<innings.length;i++){
      //  htmlString=$(innings).html();
        let teamName=$(innings[i]).find("h5").text().split("INNINGS")[0].trim();
        let oppIndex=i==0?1:0;
        //console.log(oppIndex);
        let oppName=$(innings[oppIndex]).find("h5").text().split("INNINGS")[0].trim();
        console.log("======================");
        console.log(`${teamName} and ${oppName}`);
        console.log(result);
        console.log("======================");
        let cInning = $(innings[i]);
        let allRows = cInning.find(".table.batsman tbody tr");
        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");
            if (isWorthy == true) {
                let player=$(allCols[0]).text().trim();
                let runs=$(allCols[2]).text().trim();
                let balls=$(allCols[3]).text().trim();
                let fours=$(allCols[5]).text().trim();
                let sixes=$(allCols[6]).text().trim();
                let sr=$(allCols[7]).text().trim();
                console.log(`${player}  ${balls} ${runs}  ${fours} ${sixes} ${sr}`);
                processPlayer(teamName,player,runs,balls,fours,sixes,sr,oppName,result,date,venue);
            }
        }
    }
}
function processPlayer(teamName,player,runs,balls,fours,sixes,sr,oppName,result,date,venue){
    let teamPath = path.join(__dirname, "ipl", teamName);
    dirCreator(teamPath);
    let filePath = path.join(teamPath, player + ".xlsx");
    let content = excelReader(filePath, player);
   
    let playerObj={
        teamName,
        player,
        runs,
        balls,
        fours,
        sixes,
        sr,
        oppName,
        result,
        date,
        venue
    }
    content.push(playerObj);
    excelWriter(filePath,content,player);
}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(filePath,json,sheetName){
    let newWB=xlsx.utils.book_new();
    let newWs=xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(newWB,newWs,sheetName);
    xlsx.writeFile(newWB,filePath);
}
function excelReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];
    }
    let wb=xlsx.readFile(filePath);
    let excelData=wb.Sheets[sheetName];
    let ans=xlsx.utils.sheet_to_json(excelData);
    return ans;
}
module.exports={
    sc : scoreCard
}