const lineReader = require('line-reader');


const cicsIniReg = /^EXEC CICS/;
const cicsEndReg = /$END-EXEC\.|END-EXEC/;

const sentences = [];
let currentSentence="";



//SAMPLE FILE:


lineReader.eachLine('sampleFile.txt', function(line, last) {
    try{

        if(isACommentLine(line) && !last) return

        analyzeLine(formatLine(line))

        if (last) {
            showResults()
            return false;
        }
    }catch(err){
        console.log(err)
        return false
    }

});

function analyzeLine(line){


    if(cicsIniReg.test(line) && cicsEndReg.test(line)){
        sentences.push(line)
        return
    }

    if (cicsEndReg.test(line)){
        currentSentence= currentSentence.concat(` ${line}`)
        sentences.push(currentSentence)
        currentSentence = ""
        return
    }
     if (cicsIniReg.test(line)){
         currentSentence = currentSentence.concat(` ${line}`)
         return
    }

     if (currentSentence.length > 1) {
        currentSentence= currentSentence.concat(` ${line}`)
     }


}

function isACommentLine(line){
    return  line.substring(6, 7) === "*"

}


function formatLine(line){
    const eLine = line.substring(0,72);
    return eLine.replace(/\s{2,}/g, ' ').trim().toUpperCase()
}

function showResults(){
    console.log(`Conteo de sentencias     : ${sentences.length}`)
    //console.log(`Sentencias               : ${sentences}`)
    sentences.forEach((sen,ind) => console.log(`${ind} - ${sen}`));
}