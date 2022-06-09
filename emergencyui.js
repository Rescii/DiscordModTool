// We need to get straight to the point.

exports.UI = UI;

// Requirements

let colors = require('colors');
let helper = require('./modules/helper');
let path   = require('path')
let http   = require('http');
let fs     = require('fs');

// Main

function UI(rl) {
    console.clear()
    console.log("(" + colors.red("O") + ")nline Restore - " + colors.red("Restores the latest vanilla backup from our github repo. This may not be on the latest."));

    rl.question('\\Emergency> ', (answer) => {
        switch(answer) {
            case "O" || "onlinerestore": 
                
                
        }
    })
}