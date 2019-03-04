angular.module("mixTapeApp")
.factory("renderService", ["globalSettings", "scoreService",
function(globalSettings, scoreService) {
    "use strict";

    // Checks for all the flat sharp combos that really mean something else.
    function flatSharpExceptions(pitch, pitchFileMod){
        if (pitch.substr(0,1) == "A" && pitchFileMod == "-"){
            return "G" + "#" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "A" && pitchFileMod == "#"){
            return "B" + "-" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "B" && pitchFileMod == "#"){
            // need to go up to C so also increase the octave
            return "C" + (parseInt(pitch.substr(1,1)) + 1).toString();
        }
        if (pitch.substr(0,1) == "D" && pitchFileMod == "-"){
            return "C" + "#" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "D" && pitchFileMod == "#"){
            return "E" + "-" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "C" && pitchFileMod == "-"){
            return "B" + (parseInt(pitch.substr(1,1)) - 1).toString();
        }
        if (pitch.substr(0,1) == "E" && pitchFileMod == "#"){
            return "F" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "F" && pitchFileMod == "-"){
            return "E" + pitch.substr(1,1);
        }
        if (pitch.substr(0,1) == "G" && pitchFileMod == "-"){
            return "F" + pitch.substr(1,1);
        }
        return pitch.substr(0,1) + pitchFileMod + pitch.substr(1,1);
    };

    return {
        clearStaff: function(staff){
            var staffElem = $("#" + staff)[0];
            var rows = staffElem.children
            for(var i = 0; i < rows.length; i++){
                var row = rows[i];
                var cols = row.children;
                for(var j = 0; j < cols.length; j++){
                    this.clearNote(cols[j],i);
                }
            }
        },

        clearNote: function(col, i){
            if (i % 2 == 0 && i >= globalSettings.TOP_LINE_INDEX && i < globalSettings.trebleStaff.length - 1){
                if(col.children.length >= 2){
                    for (var k = 1; k < col.children.length; k++){
                        col.removeChild(col.children[k]);
                    }
                }
            }
            else{
                if(col.children.length >= 1){
                    for (var k = 0; k < col.children.length; k++){
                        col.removeChild(col.children[k]);
                    }
                }
            }
        },

        generateStaff: function(id){
            var idString = ' id="'+id+'" '
            var idVar = "this." + id + "Staff";
            var staff = '<div '+idString+' class="staff">';
            var noteWidthPercentage = (globalSettings.NOTE_RADIUS*2)*100;
            var notePercentage = (globalSettings.LINE_HEIGHT/2) *100;
            var curLines = 0;

            for (var i = 0; i < globalSettings.trebleStaff.length; i++){
                var line = "";

                if (i % 2 == 0 && i >= globalSettings.TOP_LINE_INDEX
                    && curLines < globalSettings.STAFF_LINES){

                        line = '<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:2"/>';
                        curLines += 1;
                    }

                    staff += '<div id="'+String(i)+'" class="row" style="height:' + String(notePercentage)+'%;">';
                    for (var j = 0; j < 1/(globalSettings.NOTE_RADIUS*2); j++){
                        staff += '<svg id="'+String(j)+'" style="width:' + noteWidthPercentage + '%;"ng-click="drawNote('+i+','+j+','+idVar+')" class="cell"'+
                        '>' + line + '</svg>';

                    }
                    staff += '</div>';
                }
                staff += '</div>';
                return staff
        },

        generateNoteHTML : function(noteType, pitchType){
            console.log("notetype!" + noteType + " " + pitchType);
            var namespace = "http://www.w3.org/2000/svg";

            if (noteType == globalSettings.noteType.WHOLE) {
                var img = document.createElementNS(namespace, "image");
                if (pitchType == globalSettings.pitchType.SHARP) {
                    img.setAttributeNS(null, "href", "App/img/whole_sharp.png");
                    img.setAttributeNS(null, "width", "110%");
                    img.setAttributeNS(null, "x", "-17"); 
                    img.setAttributeNS(null, "y", "-4");
                }
                else if (pitchType == globalSettings.pitchType.FLAT) {
                    img.setAttributeNS(null, "href", "App/img/whole_flat.png");
                    img.setAttributeNS(null, "width", "110%");
                    img.setAttributeNS(null, "x", "-17"); 
                    img.setAttributeNS(null, "y", "-6"); 
                }
                else {
                    img.setAttributeNS(null, "href", "App/img/whole.png");
                    img.setAttributeNS(null, "width", "68%");
                    img.setAttributeNS(null, "x", "-10");     
                }
                return img;
            } 
            else if (noteType == globalSettings.noteType.HALF) {
                var img = document.createElementNS(namespace, "image");
                img.setAttributeNS(null, "href", "App/img/half.png");
                img.setAttributeNS(null, "width", "100%");
                img.setAttributeNS(null, "y", "-37");
                img.setAttributeNS(null, "x", "-5");
                return img;
            }
            else if (noteType == globalSettings.noteType.QUARTER) {
                var img = document.createElementNS(namespace, "image");
                if (pitchType == globalSettings.pitchType.FLAT) {
                    img.setAttributeNS(null, "href", "App/img/quarter_flat.png");
                    img.setAttributeNS(null, "width", "140%");
                    img.setAttributeNS(null, "y", "-35");
                    img.setAttributeNS(null, "x", "-17");
                }
                else if (pitchType == globalSettings.pitchType.SHARP) {
                    console.log("SHARP");
                    img.setAttributeNS(null, "href", "App/img/quarter_sharp.png");
                    img.setAttributeNS(null, "width", "140%");
                    img.setAttributeNS(null, "y", "-35");
                    img.setAttributeNS(null, "x", "-16");
                }
                else {
                    console.log("else, pitch is:" + pitchType + ":");
                    img.setAttributeNS(null, "href", "App/img/quarter.png");
                    img.setAttributeNS(null, "width", "100%");
                    img.setAttributeNS(null, "y", "-27");
                    img.setAttributeNS(null, "x", "-8");
                }
                return img;
            } 
            else if (noteType == globalSettings.noteType.EIGHTH) {
                var img = document.createElementNS(namespace, "image");
                img.setAttributeNS(null, "href", "App/img/eighth.png");
                img.setAttributeNS(null, "width", "100%");
                img.setAttributeNS(null, "y", "-30");
                img.setAttributeNS(null, "x", "4");
                return img;
            } 
            else if (noteType == globalSettings.noteType.SIXTEENTH) {
                var img = document.createElementNS(namespace, "image");
                img.setAttributeNS(null, "href", "App/img/sixteenth.png");
                img.setAttributeNS(null, "width", "190%");
                img.setAttributeNS(null, "x", "-8");
                img.setAttributeNS(null, "y", "-33");
                return img;
            } 
        },
        convertToNote : function(i, pitchType, noteType){
            var pitch = globalSettings.trebleStaff[i];
            var time_duration = 1;
            var pitchFileMod = "";
            if (noteType == globalSettings.noteType.SIXTEENTH){
                time_duration = .25;
            }
            if(noteType == globalSettings.noteType.EIGHTH){
                time_duration = .5;
            }
            if(noteType == globalSettings.noteType.HALF){
                time_duration = 2;
            }
            if(noteType == globalSettings.noteType.WHOLE){
                time_duration = 4;
            }
            if (pitchType == globalSettings.notePitchMod.SHARP){
                pitchFileMod = "#";
            }
            if(pitchType == globalSettings.notePitchMod.FLAT){
                pitchFileMod = "-";
            }
            var fileString = flatSharpExceptions(pitch,pitchFileMod);
            var note = {"note":fileString, "duration":time_duration};
            return note;
        },

        resizeScore: function(width) {
            scoreService.resizeDisplay(window.innerWidth);
        },

        drawScore: function(melody, chord) {
            scoreService.drawScore(melody, chord);
        },

        initialise: function(melodyScore, chordsScore) {
            scoreService.initialise(melodyScore, chordsScore);
        }
    }
}]);
