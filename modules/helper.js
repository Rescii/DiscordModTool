let colors = require('colors')
let morefs = require('./morefs')
let find = require('find-process');

console.newline = function() {
    console.log("\n")
}

exports.startOut = function() {
    console.log("("+colors.green("E")+")xtract - " + colors.cyan("Extracts / decompiles discord to ./discord"));
    console.log("("+colors.green("P")+")atch - " + colors.cyan("Restarts discord and applies the updates made in ./discord"));
    console.log("("+colors.green("B")+")ackup - " + colors.cyan("Backs up ./discord. It's reccommended to do this consistently + before modding."));
    console.log("("+colors.green("R")+")estore - " + colors.red("Restores current backup from appdata/discordmodtool/backup and replaces EVERYTHING in ./discord"));
    console.log("("+colors.green("V")+")anilla Restore - " + colors.red("Restores vanilla backup *normal discord* and replaces EVERYTHING in ./discord"));
    console.log("("+colors.green("D")+")elete - " + colors.red("Deletes EVERYTHING from ./discord. YOU CAN NOT GET IT BACK UNLESS YOU BACK UP!"));
    console.log("Emergenc("+ colors.red("Y") +") - " + colors.red("Opens emergency GUI. This GUI should be used if something that restores dont fix"));
    console.newline()
}

exports.GetRoot = function(){return process.env.LOCALAPPDATA+"\\Discord"};
exports.GetCore = function(){return exports.GetApp(exports.GetRoot()) + "\\modules\\discord_desktop_core-3\\discord_desktop_core\\core.asar"};
exports.GetMain = function(){return exports.GetApp(exports.GetRoot()) + "\\resources\\app.asar"};
exports.GetApp  = function(){return morefs.GetFileThatStartsWith(exports.GetRoot(), "app-")};