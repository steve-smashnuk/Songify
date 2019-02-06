angular.module("mixTapeApp")
    .constant("globalSettings", {
        debug: 1,
        lineHeight: 0.05,
        measureHeight: 0.3,
        measureLineSpacing: 0.3,
        measureWidth: 0.4,
        numLines: 5, // Number of lines in a staff
        numSpaces: 4, // Number of spaces in a staff
        numMeasures: 4,
        numMeasureLines: 4,
        noteRadius: 0.01,
        paddingX: 0.2,
        paddingY: 0.2,
        noteOffsetX: 0.4,
        noteOffsetY: 2.1,
        trebleStaff: ["C","D","E","F","G","A","B","C","D","E","F","G","A","B","C"],
    });
