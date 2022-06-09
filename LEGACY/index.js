const readline = require('readline');
const ASAR = require('asar');
const fs = require('fs');
const morefs = require('../modules/morefs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});



function GetRoot(){return process.env.LOCALAPPDATA+"\\Discord\\"};
function GetCore(){return GetApp(GetRoot()) + "\\modules\\discord_desktop_core-3\\discord_desktop_core\\core.asar"};
function GetMain(){return GetApp(GetRoot()) + "\\resources\\app.asar"};
function GetApp() {return morefs.GetFileThatStartsWith(GetRoot(), "app-")};

function StartPrint() {
    console.log("Enter a command.\n");
    console.log("(S)ettings - Change settings.");
    console.log("(E)xtract - Extracts the files from the ASAR archive.");
    console.log("(P)ack - Packs the files into the ASAR archive.");
    console.log("(D)elete - Deletes EVERYTHING from C:/DiscordExtract.");
    console.log("(Q)uickMod - Allows you to add pre-made simple modifications instantly! (Must be extracted first or have a pre-existing mod.)");
    console.log("(B)ackup - Creates a backup of the current ASAR archive. (RECCOMENDED BEFORE MODDING)");
    console.log("(L)oad Backup - Loads your current backup, use if you accidently broke discord.")
}

function Extract() {

    console.clear();
    console.log("Starting extraction...");
   
    var Core = GetCore();
    var Main = GetMain();
    
    console.log("[1/5] Create main folder."); fs.mkdirSync("C:\\DiscordExtract");
    console.log("[2/5] Create core folder."); fs.mkdirSync("C:\\DiscordExtract\\CORE");
    console.log("[3/5] Create main folder."); fs.mkdirSync("C:\\DiscordExtract\\MAIN");
    console.log("[4/5] Extracting core extraction files."); ASAR.extractAll(Core, "C:\\DiscordExtract\\CORE");
    console.log("[5/5] Extracting main extraction files."); ASAR.extractAll(Main, "C:\\DiscordExtract\\MAIN");
    console.log("Everything is done! You can find your files in C:\\DiscordExtract");
    console.log("The CORE asar handles mostly everything. The MAIN asar handles booting discord.");

}

function Pack() {
    console.clear();
    console.log("Start packing...");
    // pack ASAR

    var Core = GetCore();
    var Main = GetMain();

    console.log("[1/4] Deleting core archive."); if (fs.existsSync(Core)) { fs.rmSync(Core); }
    console.log("[2/4] Delete app archive."); if (fs.existsSync(Main)) { fs.rmSync(Main); }
    console.log("[3/4] Copy to discord_desktop_core-3 folder."); ASAR.createPackage("C:\\DiscordExtract\\CORE", Core);
    console.log("[4/4] Copy to resources folder."); ASAR.createPackage("C:\\DiscordExtract\\MAIN", Main);
    console.clear();
    console.log("Packed!");
}

function Delete() {
    console.clear();
    console.log("ARE YOU SURE THAT YOU WANT TO DELETE EXTRACTION FOLDER? THIS CANNOT BE UNDONE.");
    console.log("[Y]es | [N]o");

    QuestionAdvanced('? ', (Response) => {
        if (Response.toLowerCase() == "y") {
            console.log("Deleting C:/DiscordExtract...");
            fs.rmdirSync("C:/DiscordExtract", { recursive: true });
            console.clear();
            console.log("!! Deleted C:/DiscordExtract!");
            StartPrint();
            Main();
        } else {
            console.clear();
            console.log("!! Cancelled deletion.");
            StartPrint();
            Main();
        }
    });
}

function QuickMod() {
    console.clear();
    console.log("Quick mod | V1.0 | EPOCH: " + new Date().getTime());
    console.log("Enable [D]evtools");

    QuestionAdvanced("> ", (Option) => {
        Option = Option.toLowerCase();
        if (Option == "d") {
            console.log("Modifying core...");
            fs.readFile("C:\\DiscordExtract\\CORE\\app\\mainScreen.js", 'utf8', function (err,data) {
                if (err) {return console.log(err);}
                var result = data.replace("const ENABLE_DEVTOOLS = _buildInfo.default.releaseChannel === 'stable' ? settings.get('DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING', false) : true;", 'const ENABLE_DEVTOOLS = true;');
                fs.writeFile("C:\\DiscordExtract\\CORE\\app\\mainScreen.js", result, 'utf8', function (err) {if (err) return console.log(err);});
            });
            fs.readFile("C:\\DiscordExtract\\CORE\\app\\index.js", 'utf8', function (err,data) {
                if (err) {return console.log(err);}
                var result = data.replace("const enableDevtoolsSetting = global.appSettings.get('DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING', false);", 'const enableDevtoolsSetting = true;');
                var final = result.replace("const enableDevtools = buildInfo.releaseChannel === 'stable' ? enableDevtoolsSetting : true;", 'const enableDevtools = true;');
                fs.writeFile("C:\\DiscordExtract\\CORE\\app\\index.js", final, 'utf8', function (err) {if (err) return console.log(err);});
            });
            
            console.clear();
            console.log("!! Added the ability to open devtools back to your mod!");
        }
    });
    
}

function Main() {
    rl.question('> ', (Option) => {
        Option = Option.toLowerCase();
        switch (Option) {
            case "s":
                console.clear();
                console.log("Settings | V1.0 | EPOCH: " + new Date().getTime());
                break;
            case "e":
                if(fs.existsSync("C:/DiscordExtract")){
                    console.log("!! C:/DiscordExtract already exists. Please delete it and try again. Or use the reset command.\n");
                    StartPrint();
                    Main();
                } else {
                    Extract();
                    StartPrint();
                    Main();
                }
                break;
            case "p":
                Pack();
                StartPrint();
                Main();
                break;
            case "d":
                Delete();
                StartPrint();
                Main();
                break;
            case "q":
                QuickMod();

                break;
            case "b":
                break;
            case "l":
                break;
            default:
                console.clear();
                console.error("Invalid command \"%s\"", Option);
                StartPrint();
                Main();
                return false;
        }
    });
}

StartPrint();
Main();