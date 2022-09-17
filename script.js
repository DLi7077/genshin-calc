//indexes for array
var CharacterLevel=0
var BaseAttack=1;
var TotalAttack=2;
var EnergyRecharge=3;
var EM=4;
var CritRate=5;
var CritDamage=6;
var SkillElement=7;
var DmgBonus=8;
var SkillScaling=9;
var BurstScaling=10;
var reaction=11;
var CharOther=12;
var CharSkill=13;
var CharBurst=14;

var SkillNoCrit=15;
var SkillCritHit=16;
var SkillAverage=17;
var BurstNoCrit=18;
var BurstCritHit=19;
var BurstAverage=20;

let stat1={};
let stat2={};
let stats=[stat1,stat2];
stats[0][0]=100;

var ElementTarget=document.getElementById("AELE").value;//element on target



let ChongyunNormalATK=[70,75.7,81.4,89.54,95.24,101.75,110.7,119.66,128.61,138.38,148.15,157.92,167.68,177.45,187.22];
let ChongyunSkill=[172.04,184.94,197.85,215.05,227.95,240.86,258.06,275.26,292.47,309.67,326.88,344.08,365.59,387.09,408.6];
let ChongyunBurst=[142.4,153.08,163.76,178,188.68,199.36,213.6,227.84,242.08,256.32,270.56,284.8,302.6,320.4,338.2];

function calculate(ID,num){//num is div id
    // alert("Character level is: "+document.getElementById("BATK").value);
    // all variables needed for calculation
//front stats
// alert(document.querySelector(`.${ID} > #lv`).value); 
var build=num-1;
    stats[build][CharacterLevel]= parseFloat(document.querySelector(`.${ID} > #lv`).value);//character level
    stats[build][BaseAttack]= parseInt(document.querySelector(`.${ID} > #BATK`).value);//base attack for bonuses
    stats[build][TotalAttack]= parseFloat(document.querySelector(`.${ID} > #FATK`).value);//total attack
    stats[build][EnergyRecharge]=parseInt(document.querySelector(`.${ID} > #ER`).value);//energy recharge
    
//crit
    stats[build][CritRate]=parseFloat(document.querySelector(`.${ID} > #CR`).value)*.01;
    stats[build][CritDamage]=parseFloat(document.querySelector(`.${ID} > #CD`).value)*.01+1;


//dmg bonuses
    stats[build][DmgBonus]=parseFloat(document.querySelector(`.${ID} > #DMGBonus`).value)*.01;//damage bonus
    stats[build][SkillScaling]=parseFloat(document.querySelector(`.${ID} > #SkillScaling`).value)/100;//skill scaling
    stats[build][BurstScaling]=parseFloat(document.querySelector(`.${ID} > #BurstScaling`).value)/100;//burst scaling



//---<FIXED>---identified problem: melt undercalculates dmg, needs boost
//reaction
    stats[build][reaction]= "";
    
//enemy stats
    var EnemyLevel=parseFloat(document.getElementById("eLv").value);
    var EnemyDefense=5*EnemyLevel+500;
    var Resistance= parseFloat(document.getElementById("resist").value)*.01;
    var DefReduce=parseFloat(document.getElementById('DefShred').value)*.01;
    
    var DMGReduction=(stats[build][CharacterLevel]+100)/(stats[build][CharacterLevel]+EnemyLevel+200);
    var DefMultiplier=DMGReduction;
    if(DefReduce>0){
        EnemyDefense-=DefReduce*EnemyDefense;
        DMGReduction=EnemyDefense/(EnemyDefense+5*stats[build][CharacterLevel]+500);
        DefMultiplier=1-DMGReduction;
    }
    
    var OtherBonus=parseFloat(document.getElementById("other").value)*.01;//adding other boosts ex: from constellations
    var SkillBonus=parseFloat(document.getElementById("otherSkill").value)*.01;
    var BurstBonus=parseFloat(document.getElementById("otherBurst").value)*.01;
    
    stats[build][CharOther]=parseFloat(document.querySelector(`.${ID}> #otherx`).value)*.01;
    stats[build][CharSkill]=parseFloat(document.querySelector(`.${ID}> #otherxS`).value)*.01;
    stats[build][CharBurst]=parseFloat(document.querySelector(`.${ID}> #otherxB`).value)*.01;
    var AtkBonus=parseFloat(document.querySelector(`#otherAtk`).value)*.01;
    var EMBonus=parseFloat(document.querySelector(`#otherEM`).value);
        //elemental reaction 

    //var DefMultiplier=1-DMGReduction;  not sure if this is right

    //enemy Defense
    var ResShred=parseFloat(document.getElementById("resShred").value)*.01;//count resistance shred like 4pc VV
    
    if(document.getElementById('4VV').checked){
        if(stats[build][SkillElement]==='Anemo'||stats[build][SkillElement]==='Geo'||stats[build][SkillElement]==='Physical'){
        }
        else{
            ResShred+=.4;
        }
    }

    //element of skill and target
    stats[build][SkillElement]=document.querySelector(`.${ID}> #DmgELE`).value;//element of the skill
    
    ElementTarget=document.getElementById("AELE").value;//element on target
    stats[build][EM]= parseFloat(document.querySelector(`.${ID} > #EM`).value)+EMBonus;//Elemental Mastery
    var VapMelt=0;
    if(document.getElementById("4witch").checked){
        VapMelt+=.15;
    }
    //sucrose em buff
    if(document.getElementById('Sucrose').checked){
        if(document.getElementById('MollisFavonius').checked){
            stats[build][EM]+=.2*parseFloat(document.getElementById('SucroseEM').value);
        }
        if(document.getElementById('CatalystConversion').checked){
            stats[build][EM]+=50;
        }
        if(document.getElementById('SucroseC6').checked){
            if(stats[build][SkillElement]==='Anemo'||stats[build][SkillElement]==='Geo'||stats[build][SkillElement]==='Physical'){
            }
            else{
                OtherBonus+=.2; 
            }
        }
    }
    var KazuEM=parseFloat(document.getElementById('KazEM').value);

    if(document.getElementById('Kazuha').checked){
        if(document.getElementById('C2').checked){
            KazuEM+=200;
            stats[build][EM]+=200;
        }
        if(document.getElementById('PoF').checked){
            if(stats[build][SkillElement]==='Anemo'||stats[build][SkillElement]==='Geo'||stats[build][SkillElement]==='Physical'){
            }
            else{
                stats[build][DmgBonus]+=KazuEM*.0004;
            }
        }
        
    }
    //character buffs
    var bennetBase=parseFloat(document.getElementById('bennettBase').value);
    var bennetBonus=parseFloat(document.getElementById('%bonus').value)*.01;
    if(document.getElementById('bennett').checked){
        stats[build][TotalAttack]+=bennetBase*bennetBonus;
        if(document.getElementById('BennettC6').checked){
            if(stats[build][SkillElement]=='Pyro'){
                stats[build][DmgBonus]+=.15;
            }
        }
    }
    if(document.getElementById('noblesse').checked){
        BurstBonus+=.2;
    }
    if(document.getElementById('4noblesse').checked){
        stats[build][TotalAttack]+=.2*stats[build][BaseAttack];
    }

    if(document.getElementById('Totm').checked){
        stats[build][TotalAttack]+=.2*stats[build][BaseAttack];
    }

    if(document.getElementById('emblem').checked){
        if(stats[build][EnergyRecharge]>=300){
            BurstBonus+=.75;
        }
        else{
            BurstBonus+=.25*stats[build][EnergyRecharge]*.01;
        }
    }
    if(document.getElementById('archaic').checked){
        stats[build][DmgBonus]+=.35;
    }
    if(document.getElementById('Lavawalk').checked){
        if(ElementTarget=='Pyro'){ 
            stats[build][DmgBonus]+=.35;
        }
    }
    if(document.getElementById('thunderSooth').checked){
        if(ElementTarget=='Electro'){ 
            stats[build][DmgBonus]+=.35;
        }
    }
    if(document.getElementById('4instructor').checked){
        stats[build][EM]+=120;
    }

    if(document.getElementById('adeptus').checked){
        stats[build][TotalAttack]+=371;
        stats[build][CritRate]+=.12;
    }
        
    if(document.getElementById('potion').checked){
        stats[build][DmgBonus]+=.25;
    }
    if(document.getElementById('NoTomorrow').checked){
        stats[build][CritRate]+=.2;
        stats[build][CritDamage]+=.2;
    }

    if(document.getElementById('thrillingTales').checked){
        stats[build][TotalAttack]+=.48*stats[build][BaseAttack];
    }

    //something might be wrong with geoResonance, test it.
    if(document.getElementById('geoRes').checked){
        stats[build][DmgBonus]+=.15;
        if(stats[build][SkillElement]=="Geo"){
            ResShred+=.2;
        }
    }
    if(document.getElementById('supcon').checked){
        if(stats[build][SkillElement]=='Physical'){
            ResShred+=.4;
        }
    }

    
    
    
    //final em calculation
    VapMelt+= parseFloat((2.78*stats[build][EM])/(stats[build][EM]+1400));//Melt/ Vaporize bonus
    var ReactionBonus=ElementalReaction(build,stats[build][SkillElement],ElementTarget,VapMelt);

    if(document.getElementById('Mona').checked){
        stats[build][DmgBonus]+=parseFloat(document.getElementById('omen%').value)*.01;
        if(document.getElementById('MonaC1').checked){
            if(stats[build][reaction]==="Vaporize"){
                VapMelt+=.15;
            }
        }
    }
    if(document.getElementById('Sara').checked){
        stats[build][TotalAttack]+=parseFloat(document.getElementById('SaraBase').value)*
        parseFloat(document.getElementById('sara%bonus').value)*.01;
        if(document.getElementById('SaraC6').checked){
            if(stats[build][SkillElement]=='Electro'){
                stats[build][CritDamage]+=.6;
            }
        }
    }

//final calculation
    
stats[build][DmgBonus]+=OtherBonus+stats[build][CharOther];
stats[build][TotalAttack]+=AtkBonus*stats[build][BaseAttack];
//bonus scaling
    var BonusScale=0;
    BonusScale+=parseFloat(document.getElementById('bonusFlatScaling').value);

    var SkillTotal=stats[build][TotalAttack]*stats[build][SkillScaling]+BonusScale;
    var BurstTotal=stats[build][TotalAttack]*stats[build][BurstScaling]+BonusScale;
    if(document.getElementById('ShenHe').checked){
        if(stats[build][SkillElement]==='Cryo'){
            var ShenHeATK=parseFloat(document.getElementById('ShenHeATK').value);
            var ShenHeScale=parseFloat(document.getElementById('ShenHe%Bonus').value)*.01;
            SkillTotal+=ShenHeATK*ShenHeScale;
            BurstTotal+=ShenHeATK*ShenHeScale;
        }
        if(document.getElementById('ShenHeBurst').checked){
            ResShred+=parseFloat(document.getElementById('ShenHeResShred').value*.01);
        }
        if(document.getElementById("ShenHeA1").checked&&stats[build][SkillElement]==='Cryo'){
            stats[build][DmgBonus]+=.15;
        }
        if(document.getElementById("ShenHeA4").checked){
            stats[build][DmgBonus]+=.15;
        }

    }
//make this a separate function for exclusively calculating damage

    var ResPercent=Resistance-ResShred;//final resistance
    var ResMultiplier= ResistanceCalc(ResPercent);//get actual multiplier
    var DMGreduced=DefMultiplier*ResMultiplier*ReactionBonus;//excluding dmg scaling

    var SkillOut=SkillTotal*DMGreduced*(1+stats[build][DmgBonus]+SkillBonus+stats[build][CharSkill]);
    stats[build][SkillNoCrit]=SkillOut;
    var SkillCrit=SkillOut*(stats[build][CritDamage]);
    stats[build][SkillCritHit]=SkillCrit;
    var Skillavg=SkillOut*(1-stats[build][CritRate])+SkillCrit*stats[build][CritRate];
    stats[build][SkillAverage]=Skillavg;

    var BurstOut=BurstTotal*DMGreduced*(1+stats[build][DmgBonus]+BurstBonus+stats[build][CharBurst]);
    stats[build][BurstNoCrit]=BurstOut;
    var BurstCrit=BurstOut*(stats[build][CritDamage]);
    stats[build][BurstCritHit]=BurstCrit;
    var Burstavg=BurstOut*(1-stats[build][CritRate])+BurstCrit*stats[build][CritRate];
    stats[build][BurstAverage]=Burstavg;
    


    // document.getElementById("output").textContent='non-crit hit:\t'
    // + IncomingDmg.toFixed(0)
    // +'\nCrit Hit:\t'+IncomingCrit.toFixed(0);


    // //detailed console calculation


    document.querySelector(`#console${num}`).innerHTML=
    'Level:\t\t'+stats[build][CharacterLevel]+
    '\nAttack:\t\t'+(stats[build][TotalAttack].toFixed(1)||0)+
    //'\nAdditive Damage:\t\t'+AddBonus*AddPercent+
    '\nEle Mastery:\t'+stats[build][EM]
    +'\nMelt/ Vap:\t'+((VapMelt*100).toFixed(1)||0)+'%'
    +'\nCrit Rate:\t'+(stats[build][CritRate]*100).toFixed(1)+'%\nCrit Damage:\t'+((stats[build][CritDamage]-1)*100).toFixed(1)+'%'
    +'\nTarget ELE: \t'+ElementTarget+'\nDMG ELE: '+stats[build][SkillElement]
    +'\nER%:\t\t'+(stats[build][EnergyRecharge]).toFixed(1)+'%\nDMG Bonus:\t'+(stats[build][DmgBonus]*100).toFixed(1)+'%'
    +'\nReaction:\t'+ReactionBonus.toFixed(2)
    +'\nEnemy Level:\t'+EnemyLevel+'\nEnemy DEF:\t'+EnemyDefense.toFixed(2)+'\nResistance:'+ResMultiplier.toFixed(2)
    +'\nBonus Flat\t'+BonusScale
    +'\nSkill Out:\t'+SkillOut.toFixed(1)+"\nDMG Reduce:"+DMGReduction.toFixed(3)
    +'\nDEF Multi:\t'+DefMultiplier.toFixed(3);

    document.querySelector(`#skill${num}`).innerHTML=
    'SKILL DAMAGE\nNon-Crit:\t'+ SkillOut.toFixed(0)
    +'\nCrit Hit:\t\t'+SkillCrit.toFixed(0)
    +'\nAverage:\t\t'+Skillavg.toFixed(0);

    document.querySelector(`#burst${num}`).innerHTML=
    'BURST DAMAGE\nNon-Crit:  \t'+ BurstOut.toFixed(0)
    +'\nCrit Hit:  \t'+BurstCrit.toFixed(0)
    +'\nAverage:  \t'+Burstavg.toFixed(0);

    //DIFFERENCE DISPLAY
    document.querySelector(`#diffS`).innerHTML=
    'Skill DIFF\nNon-Crit:  \t'+ (stats[1][SkillNoCrit]-stats[0][SkillNoCrit]).toFixed(0)
    +'\nCrit DIFF:  \t'+(stats[1][SkillCritHit]-stats[0][SkillCritHit]).toFixed(0)
    +'\nAVG DIFF :  \t'+(stats[1][SkillAverage]-stats[0][SkillAverage]).toFixed(0);
    document.querySelector(`#diffB`).innerHTML=
    'BURST DIFF\nNon-Crit:  \t'+ (stats[1][BurstNoCrit]-stats[0][BurstNoCrit]).toFixed(0)
    +'\nCrit DIFF:  \t'+(stats[1][BurstCritHit]-stats[0][BurstCritHit]).toFixed(0)
    +'\nAVG DIFF :  \t'+(stats[1][BurstAverage]-stats[0][BurstAverage]).toFixed(0);

    // stats[build][SkillNoCrit]=SkillOut;
    // stats[build][SkillCritHit]=SkillCrit;
    // stats[build][SkillAverage]=Skillavg;
    // document.getElementById('console2').style.display='inline-block';
    // document.getElementById('skill2').style.display='inline-block';
    // document.getElementById('burst2').style.display='inline-block';
    
    
    // var elements=document.getElementById("Characters").elements;

    // for (var i = 0, element; element = elements[i++];) {
    //     if (element.type === "text" && element.value === "")
    //         alert("some inputs are empty");
    // }

    //fix it so that each box updates ONLY its corresponding console box

}

function unCheck(checkbox){
    document.getElementById(checkbox).checked=false;
}
function check(checkbox){
    document.getElementById(checkbox).checked=true;
}


function ElementalReaction(build,skill, target, VapMelt){
    if (skill==='Pyro'&&target==='Cryo'){
        stats[build][reaction]="Melt";
        return 2*(1+VapMelt);
    }
    else if(skill==='Cryo'&&target==='Pyro'){
        stats[build][reaction]="Melt";
        return 1.5*(1+VapMelt);
    }
    else if(skill==='Pyro'&&target==='Hydro'){
        stats[build][reaction]="Vaporize";
        return 1.5*(1+VapMelt);
    }
    else if(skill==='Hydro'&&target==='Pyro'){
        stats[build][reaction]="Vaporize";
        return 2*(1+VapMelt);
    }
    else{
        return 1;
    }
    
}

function ResistanceCalc(res){
    if(res>=.75){
        return 1/(4*res+1);
    }
    else if(res>=0){
        return 1-res;
    }
    return 1-(res/2);
}
function ChangeFontColor(Element,cons){
    var fontColor=document.querySelector(`#char${cons}DMG`);
    var ElementText=document.querySelector(`.character${cons}> #DmgELE`);
    if(Element=='Pyro'){
        fontColor.style.color='#fd9a00';
        ElementText.style.color='#fd9a00';
    }
    else if(Element=='Cryo'){
        fontColor.style.color='#9bfdfe';
        ElementText.style.color='#9bfdfe';
    }
    else if(Element=='Hydro'){
        fontColor.style.color='#36cdff';
        ElementText.style.color='#36cdff';
    }
    else if(Element=='Electro'){
        fontColor.style.color='#dd9dfd';
        ElementText.style.color='#dd9dfd';
    }
    else if(Element=='Anemo'){
        fontColor.style.color='#5dffd9';
        ElementText.style.color='#5dffd9';
    }
    else if(Element=='Geo'){
        fontColor.style.color='#ffca64';
        ElementText.style.color='#ffca64';
    }
    else if(Element=='Physical'){
        fontColor.style.color='#ffffff';
        ElementText.style.color='#ffffff';
    }

}

function ChangeEnemyFontColor(Element,cons){
    var ElementText=document.getElementById(cons);
    if(Element=='Pyro'){
        ElementText.style.color='#fd9a00';
    }
    else if(Element=='Cryo'){
        ElementText.style.color='#9bfdfe';
    }
    else if(Element=='Hydro'){
        ElementText.style.color='#36cdff';
    }
    else if(Element=='Electro'){
        ElementText.style.color='#dd9dfd';
    }
    else if(Element=='Anemo'){
        ElementText.style.color='#5dffd9';
    }
    else if(Element=='Geo'){
        ElementText.style.color='#ffca64';
    }
    else if(Element=='None'){
        ElementText.style.color='#ffffff';
    }

}


//big brain stuff here
//sets div image based on what element is selected

function changeBG(ElementName,divId){
    if(ElementName!="None"){
        var url=`images/Element_${ElementName}.png`;
        var div= document.getElementById(divId);
        div.style.backgroundImage=`url(${url})`;
    }
    else{
        document.getElementById(divId).style.backgroundImage='none';
    }
    
}
function show(id,divId){
    var div= document.getElementById(divId);
    if(document.getElementById(id).checked){
        div.style.display="contents";
    }
    if(!document.getElementById(id).checked){
        div.style.display="none";
    }
}

function copyOver(from,to){//think it works?
    document.querySelector(`.character${to} > #lv`).value=document.querySelector(`.character${from} > #lv`).value;
    document.querySelector(`.character${to} > #BATK`).value=document.querySelector(`.character${from} > #BATK`).value;
    document.querySelector(`.character${to} > #FATK`).value=document.querySelector(`.character${from} > #FATK`).value;
    document.querySelector(`.character${to} > #EM`).value=document.querySelector(`.character${from} > #EM`).value;
    document.querySelector(`.character${to} > #ER`).value=document.querySelector(`.character${from} > #ER`).value;
    document.querySelector(`.character${to} > #CR`).value=document.querySelector(`.character${from} > #CR`).value;
    document.querySelector(`.character${to} > #CD`).value=document.querySelector(`.character${from} > #CD`).value;
    document.querySelector(`.character${to} > #DMGBonus`).value=document.querySelector(`.character${from} > #DMGBonus`).value;
    var element=document.querySelector(`.character${from} > #DmgELE`).value
    document.querySelector(`.character${to} >#DmgELE`).value=document.querySelector(`.character${from} > #DmgELE`).value;
    changeBG(element,document.querySelector(`#charac${to}`).id);
    ChangeFontColor(element,to);
    document.querySelector(`.character${to} > #SkillScaling`).value=document.querySelector(`.character${from} > #SkillScaling`).value;
    document.querySelector(`.character${to} > #BurstScaling`).value=document.querySelector(`.character${from} > #BurstScaling`).value;
    document.querySelector(`.character${to} > #otherx`).value=document.querySelector(`.character${from} > #otherx`).value;
    document.querySelector(`.character${to} > #otherxS`).value=document.querySelector(`.character${from} > #otherxS`).value;
    document.querySelector(`.character${to} > #otherxB`).value=document.querySelector(`.character${from} > #otherxB`).value;
}

function loadBody() {
    //If detects a change, runs the process file function
    document
      .getElementById("imported")
      .addEventListener("change", processFile, false);
  }
  
  /*
  function processFile() {
    try {
      const uploadedFile = document.getElementById("imported").files[0];
      //console.log(uploadedFile);
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(uploadedFile); //Read as string
      fileReader.onloadend = () => {
        //When done reading
        const configArr = fileReader.result.split(",").map((e) => parseFloat(e));
        //console.log(configArr);
        updateHtmlImport(configArr);
      };
    } catch (err) {
      console.log("No file selected!");
    }
  }
  */
  
function uploadConfig() {
    document.getElementById("imported").click();
}
let inValues={};


let SNoCrit={};
let SCrit={};
let SAverage={};
let BNoCrit={};
let BCrit={};
let BAverage={};
let Base=[SNoCrit,SCrit,SAverage,BNoCrit,BCrit,BAverage];//basic structure;



let DamageWKazuha={};

function processFile() {
    try {
        const uploadedFile = document.getElementById("imported").files[0];
        //console.log(uploadedFile);
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(uploadedFile); //Read as string
        fileReader.onloadend = () => {
            //When done reading, skips first row then separates using new line char, creates subarray of each, then filters out results that do not use Chongyun
            const userInputs = fileReader.result.split("(IN MONTHS)\r\n")[1].split("\r\n").map(e => e.split(",")).filter(e => e[1] == 'Yes');
            inValues=userInputs;
            console.log(inValues);
            document.getElementById('DmgELE').value = "Cryo";
            changeBG("Cryo",'charac1');ChangeFontColor("Cryo",1);
            let Melt=[inValues.length];//initialize array for no Melt
            for(let i=0;i<inValues.length;i++){
                Melt[i]=[];
            }
            document.getElementById('AELE').value="Pyro";

            calcImportedSurvey(Melt,inValues);
            console.log('Melt\n');
            console.log(Melt);


            // const userInputs = fileReader.result.split("\r\n").map(e => e.split(","));
            // inValues=userInputs;
            // chongyunDMG=ChongyunMax(inValues);
            // arr= getLargest(chongyunDMG);
            // console.log(arr)

            // downloadBlob(arrayToCsv(nonMelt), 'noMelt.csv', 'text/csv;charset=utf-8;');
            downloadBlob(arrayToCsv(Melt), 'Melt.csv', 'text/csv;charset=utf-8;');
            

        };
    }
    catch (err) {
        console.log("No file selected!");
    }     
}
function ChongyunMax(list){
    // console.log(inValues);
    document.getElementById('DmgELE').value = "Cryo";
    changeBG("Cryo",'charac1');ChangeFontColor("Cryo",1);
    document.getElementById('AELE').value="Pyro";
    check('emblem');
    check('bennett');

    // check('4instructor');

    check('ShenHe');
    check('archaic');
    // document.getElementById("bennettBase").value=799;//freedom sworn
    // document.getElementById('otherAtk').value=20;//freedom sworn
    
    check('Sucrose');
    check('SucroseC6');
    document.getElementById('SucroseEM').value=1061.72;
    document.getElementById('ShenHeATK').value=6347.1;
    check('4VV');

    document.getElementById('resShred').value=10;
    document.getElementById('otherxB').value= 15+57.6;

    //reset everything
    
    return calcImported(list);
}

//https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side?answertab=active#tab-top
function arrayToCsv(data){
    return data.map(row =>
      row
      .map(String)  // convert every value to String
      .map(v => v.replaceAll('"', '""'))  // escape double colons
      .map(v => `"${v}"`)  // quote it
      .join(',')  // comma-separated
    ).join('\r\n');  // rows starting on new lines
}
function downloadBlob(content, filename, contentType) {
    // Create a blob
    var blob = new Blob([content], { type: contentType });
    var url = URL.createObjectURL(blob);
  
    // Create a link to download it
    var pom = document.createElement('a');
    pom.href = url;
    pom.setAttribute('download', filename);
    pom.click();
}

function calcImportedSurvey(list,inValues){
    // ElementTarget="None";
    // changeBG(ElementTarget,'enemy');ChangeEnemyFontColor(ElementTarget,'AELE');
    let lv=3;
    let batk=6;
    let fatk=7;
    let em=8;
    let er=11;
    let cr=9;
    let cd=10;
    let dmgb=12;
    let skilltal=16
    let bursttal=17
    let weap=4;
    let weapref=5;
    let art=13;
    let inochi=14;
    // let i=0;
    for(let i=0;i<inValues.length;i++){
        document.getElementById("lv").value = inValues[i][lv];
        document.getElementById("BATK").value = inValues[i][batk];
        document.getElementById("FATK").value = inValues[i][fatk];
        document.getElementById("EM").value = inValues[i][em];
        document.getElementById("ER").value = inValues[i][er];
        document.getElementById("CR").value = inValues[i][cr];
        document.getElementById("CD").value = inValues[i][cd];
        document.getElementById("DMGBonus").value = inValues[i][dmgb];
        let skilltalent=(inValues[i][skilltal]-1)+(inValues[i][inochi]>=5)*3;
        let bursttalent=(inValues[i][bursttal]-1)+(inValues[i][inochi]>=3)*3;
        document.getElementById("SkillScaling").value = ChongyunSkill [skilltalent];
        document.getElementById("BurstScaling").value = ChongyunBurst [bursttalent];
        
        let OtherB=0;
        let OtherS=0;
        let BurstBur=0;
        //conditional buffs based on weapons
        if(inValues[i][weap]==="Serpent Spine"){
            OtherB=25+inValues[i][weapref]*5;
        }
        if(inValues[i][weap]==="Bloodtainted Greatsword"){
            if(ElementTarget==="Pyro"){
                document.getElementById("otherx").value=9+3*inValues[i][weapref];
            }
        }
        if(inValues[i][weap]==="Akuoumaru"){
            BurstBur=(.09+inValues[i][weapref]*.01)*240;
        }
        if(inValues[i][weap]==="Luxurious Sea-Lord"){
            BurstBur+=9+3*inValues[i][weapref];
        }
        if(inValues[i][weap]==="Skyward Pride"){
            OtherB+=6+2*inValues[i][weapref];
        }
        if(inValues[i][weap]==="The Unforged"){
            document.getElementById("otherAtk").value = (15+inValues[i][weapref]*5);
        }
        if(inValues[i][weap]==="Wolf's Gravestone"){
            document.getElementById("otherAtk").value = (30+inValues[i][weapref]*1);
        }
        if(inValues[i][inochi]==6){
            BurstBur+=15;
        }
        //will be reset to 0
        document.getElementById('otherx').value=OtherB;
        document.getElementById('otherxS').value=OtherS;
        document.getElementById('otherxB').value=BurstBur;

        let artifacts=inValues[i][art];
        if(artifacts.includes('2 Noblesse')){
            check('noblesse');
        }
        if(artifacts.includes('4 Noblesse')){
            check('4noblesse');
        }
        if(artifacts.includes('4 Emblem')){
            check('emblem');
        }
        //base damage no melt
        calculate('character1',1);
        //pushing output dmg into array
        fillOutput(list,i,0);

        //with bennett (c5, 865 atk)
        check('4noblesse');
        check('bennett');
        calculate('character1',1);
        fillOutput(list,i,6);
        unCheck('4noblesse');
        unCheck('bennett');
        // //with shenhe
        check('ShenHe');
        check('ShenHeBurst');
        check('ShenHeA1');
        check('ShenHeA4');
        calculate('character1',1);
        fillOutput(list,i,12);
        unCheck('ShenHe');
        unCheck('ShenHeBurst');
        unCheck('ShenHeA1');
        unCheck('ShenHeA4');

        //with kazuha c2(968em)
        check('4VV');
        check('Kazuha');
        check('C2');
        calculate('character1',1);
        fillOutput(list,i,18);
        unCheck('C2');
        unCheck('Kazuha');

        //with sucrose (922em)
        check('Sucrose');
        calculate('character1',1);
        fillOutput(list,i,24);
        unCheck('Sucrose');
        calculate('character1',1);

        //reset other atk, artifact buffs
        unCheck('4VV');
        unCheck('noblesse');
        unCheck('4noblesse');
        unCheck('emblem');
        document.getElementById("otherAtk").value = 0;
    }
//only for filling array with data
/**
 * 
 * @param {*array,int}
 * starting from int, sets the next 6 values as dmg outputs using calculate() 
 */
        
    function fillOutput(list, index1,index2){
        list[index1][index2]=stat1[SkillNoCrit].toFixed(0);
        list[index1][index2+1]=stat1[SkillCritHit].toFixed(0);
        list[index1][index2+2]=stat1[SkillAverage].toFixed(0);
        list[index1][index2+3]=stat1[BurstNoCrit].toFixed(0);
        list[index1][index2+4]=stat1[BurstCritHit].toFixed(0)
        list[index1][index2+5]=stat1[BurstAverage].toFixed(0);
    }
}
/***
 * takes 2d array of multiple artifact distributions
 * places substats in to list of corresponding substat distribution
 * returns 1d ls
 */

function calcImported(list){
    damageOutput= [];
    for (let i =0;i<list.length-1;i++){//for each element
        //get the stats
        let lv= list[i][0];
        let base= list[i][1];
        let tATK= list[i][2];
        let eleMast= list[i][3];
        let EnerCharge=list[i][4];
        let critRate= list[i][5];
        let critDMG=list[i][6];
        let dmgBon= list[i][7];
        let skDMG= list[i][8];
        let burDMG=list[i][9];

        document.getElementById("lv").value = lv;
        document.getElementById("BATK").value = base;
        document.getElementById("FATK").value = tATK;
        document.getElementById("EM").value = eleMast;
        document.getElementById("ER").value = EnerCharge;
        document.getElementById("CR").value = critRate;
        document.getElementById("CD").value = critDMG;
        document.getElementById("DMGBonus").value = dmgBon;
        // document.getElementById("SkillScaling").value= skDMG;
        document.getElementById("SkillScaling").value= 0;
        document.getElementById("BurstScaling").value=burDMG;
        
        //calculate
        
        calculate('character1',1);
        damageOutput[i]= stats[0][BurstCritHit];
    }
    return damageOutput;
}

function getLargest(list){
    ans=[];
    let best=0;
    for( let i =0;i<list.length;i++){
        if(list[i]>best){
            best=list[i];
            ans[0]=i;
        }
    }
    ans[1]=best;
    console.log(ans[0]+"\n");
    console.log(ans[1]+"\n");
    return ans;

}
  /*
  function updateHtmlImport(configArr) {
      //update this for 
    CharacterLevel = configArr[0];
    BaseAttack = configArr[1];
    TotalAttack = configArr[2];
    EM = configArr[3];
    EnergyRecharge = configArr[4];
    CritRate = configArr[5];
    CritDamage = configArr[6];
    DmgBonus = configArr[7];
    SkillScaling = configArr[8];
    BurstScaling = configArr[9];
    
    document.getElementById("lv").value = CharacterLevel;
    document.getElementById("BATK").value = BaseAttack;
    document.getElementById("FATK").value = TotalAttack;
    document.getElementById("EM").value = EM;
    document.getElementById("ER").value = EnergyRecharge;
    document.getElementById("CR").value = CritRate;
    document.getElementById("CD").value = CritDamage;
    document.getElementById("DMGBonus").value = DmgBonus;
    document.getElementById("SkillScaling").value = SkillScaling;
    document.getElementById("BurstScaling").value = BurstScaling;
    calculate("character1", 1);
    //console.log("File uploaded!");
  } */
