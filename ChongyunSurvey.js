// no longer need this 
function calcImported(list,inValues){
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