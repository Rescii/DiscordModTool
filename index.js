// Requirements

let fs = require("fs")
let path = require("path")
var axios = require('axios');
let asar = require("asar")
let colors = require("colors")
let child_proccess = require("child_process")

let helper = require('./modules/helper')
let morefs = require('./modules/morefs')
let args = require('./modules/args')
let emergencyui = require('./emergencyui')

let readline = require('readline')
const find = require("find-process")
const { env } = require("process")
const { setTimeout } = require("timers")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Handle args

let argus = process.argv.slice(2)
let advanced = args.argshas(argus, "--adv")

// Random stuff

function DebugPrint(Str) {
    advanced ? console.log("<"+colors.red("ADVANCED")+"> | "+Str) : null
}

function CheckForDiscord(foundfunc, elsefunc) {

    let lst = [];
    find('name', 'Discord', true).then(function(list) {lst=list});

}

function KillDiscord(Callback) {
    find('name', 'Discord', true)
        .then(function(list) {
                list.forEach(function(prcs) {
                    process.kill(prcs.pid)
                })
            })
        .finally(function() {
            Callback()
        })

}

function BetterMkdir(where) {
    if(!fs.existsSync(where)) {
        fs.mkdirSync(where)
        return true;
    } else {
        return false;
    }
}

function backup(delete_old, override_name) {
    override_name = override_name || "backup"

    if(fs.existsSync(process.env.APPDATA+"/discordmodtool/"+override_name)) { 
        if(!delete_old) {
            let name = override_name+"-"+Date.now()
            fs.renameSync(process.env.APPDATA+"/discordmodtool/"+override_name, process.env.APPDATA+"/discordmodtool/"+name)
            DebugPrint(`Renamed APPDATA/discordmodtool/${override_name} to APPDATA/discordmodtool/`+name)
        } else {
            fs.rmSync(process.env.APPDATA+"/discordmodtool/"+override_name, { recursive: true })
            DebugPrint("!! DELETED OLD BACKUP")
        }
    }

    BetterMkdir(process.env.APPDATA+`/discordmodtool/${override_name}`); DebugPrint(`Create APPDATA/discordmodtool/${override_name}/`)

    DebugPrint("Copying files...")
    morefs.copyFolderRecursiveSync('./discord/core', process.env.APPDATA+`/discordmodtool/${override_name}`); DebugPrint('Copied CORE')
    morefs.copyFolderRecursiveSync('./discord/boot', process.env.APPDATA+`/discordmodtool/${override_name}`); DebugPrint('Copied BOOT')

    DebugPrint('Backed up.')

    return true
    
} 

function patchDiscord() {
    console.log(colors.yellow("Patching discord..."))
    
    console.log("("+colors.cyan("1")+"/"+colors.green("4")+") - " + colors.green("Gathering folders..."))

    let core_modded = path.resolve(".\\discord\\core"); DebugPrint("Discovered .\\discord\\core")
    let boot_modded = path.resolve(".\\discord\\boot"); DebugPrint("Discovered .\\discord\\boot")

    let core_modtarget = helper.GetCore(); DebugPrint("Discovered " + core_modtarget)
    let app_modtarget = helper.GetMain(); DebugPrint("Discovered " + app_modtarget)

    console.log("("+colors.cyan("2")+"/"+colors.green("4")+") - " + colors.green("Deleting original ASAR files..."))

    fs.existsSync(core_modtarget) ? fs.rmSync(core_modtarget) : null
    fs.existsSync(app_modtarget) ? fs.rmSync(app_modtarget) : null
    
    console.log("("+colors.cyan("3")+"/"+colors.green("4")+") - " + colors.green("Creating new ASAR files..."))

    asar.createPackage(core_modded, core_modtarget); DebugPrint("Created core.asar")
    asar.createPackage(boot_modded, app_modtarget); DebugPrint("Created app.asar")

    console.log("("+colors.cyan("4")+"/"+colors.green("4")+") - " + colors.green("Opening discord test enviroment..."))

    console.log(colors.green("Done. Opening discord in a test console, just CTRL C this window or close the test CMD window."))

    let tim = setTimeout(function() {
        let cmd = child_proccess.spawnSync(`start bin/discdebug.exe"`, [], {shell: true})
        clearTimeout(tim)
    }, 1000, "DISCORD DEBUGGER")

    console.log("Finish.")

}

// Questions

function Extract() {
    console.clear()
    console.log(colors.yellow("Extracting discord..."))

    console.log("("+colors.cyan("1")+"/"+colors.green("5")+") - " + colors.green("Detecting path..."))

    let CORE = helper.GetCore()
    let APP = helper.GetMain()

    DebugPrint("CORE: "+CORE); DebugPrint("APP: "+APP)
    console.log("("+colors.cyan("2")+"/"+colors.green("5")+") - " + colors.green("Creating folders..."))   

    if(!BetterMkdir("./discord")) { console.clear(); return false }; DebugPrint("Made folder "+path.resolve("./discord"))
    if(!BetterMkdir("./discord/core")) { console.clear(); return false }; DebugPrint("Made folder "+path.resolve("./discord/core"))
    if(!BetterMkdir("./discord/boot")) { console.clear(); return false }; DebugPrint("Made folder "+path.resolve("./discord/boot"))
    
    console.log("("+colors.cyan("3")+"/"+colors.green("5")+") - " + colors.green("Extracting CORE..."))   

    asar.extractAll(CORE, "./discord/core")
    DebugPrint("Extracted CORE to ./discord/core")

    console.log("("+colors.cyan("4")+"/"+colors.green("5")+") - " + colors.green("Extracting BOOT..."))   

    asar.extractAll(APP, "./discord/boot")
    DebugPrint("Extracted BOOT to ./discord/boot")

    console.log("("+colors.cyan("5")+"/"+colors.green("5")+") - " + colors.green("Backing up..."))

    backup(true, "backup-vanilla")

    console.clear()
    console.log(colors.green("Finished backing up!"))
    console.log(colors.green("You'll find your main code in ") + colors.cyan("./discord/core"))
    console.log(colors.green("You'll find your boot code in ") + colors.cyan("./discord/boot"))
    console.log()

    return true

}

function Patch() {
    if(!fs.existsSync("./discord")) { console.clear(); console.log(colors.red("No discord folder found!")); return false }
    if(!fs.existsSync("./discord/core")) { console.clear(); console.log(colors.red("discord/core not found!")); return false }
    if(!fs.existsSync("./discord/boot")) { console.clear(); console.log(colors.red("discord/boot not found!")); return false }

    console.clear()
    console.log(colors.green(colors.bold("Waiting until discord is killed or confirmed not running.")))

    KillDiscord(function() {
        console.clear()
        patchDiscord()
    })

}

function Backup() {
    if(!fs.existsSync("./discord")) { console.clear(); console.log(colors.red("No discord folder found!")); return false }
    if(!fs.existsSync("./discord/core")) { console.clear(); console.log(colors.red("discord/core not found!")); return false }
    if(!fs.existsSync("./discord/boot")) { console.clear(); console.log(colors.red("discord/boot not found!")); return false }

    console.clear()
    console.log(colors.cyan("Backing up ./discord to " + colors.white(process.env.APPDATA+"\\discordmodtool\\backup") + ".."))
    backup(true)
    console.clear()
    console.log(colors.green("Finished backing up!"))
    console.log(colors.green("Latest backup is at ") + colors.cyan(process.env.APPDATA+"\\discordmodtool\\backup"))
    return true
}

function Restore(foldname="backup") {
    if(!fs.existsSync("./discord")) { console.clear(); console.log(colors.red("No discord folder found!")); return false }
    if(!fs.existsSync("./discord/core")) { console.clear(); console.log(colors.red("discord/core not found!")); return false }
    if(!fs.existsSync("./discord/boot")) { console.clear(); console.log(colors.red("discord/boot not found!")); return false }

    console.clear()
    console.log(colors.cyan("Restoring discord from " + colors.white(process.env.APPDATA+"\\discordmodtool\\"+foldname) + ".."))
    console.log(colors.cyan("Restoring CORE..."))

    DebugPrint("Deleting .\\discord\\core")
    fs.rmSync("./discord/core", { recursive: true })

    DebugPrint("Copying " + process.env.APPDATA+`\\discordmodtool\\${foldname}\\core to .\\discord\\core`)
    morefs.copyFolderRecursiveSync(process.env.APPDATA+`\\discordmodtool\\${foldname}\\core`, ".\\discord")

    console.log(colors.cyan("Restoring BOOT..."))
    
    DebugPrint("Deleting .\\discord\\boot")
    fs.rmSync("./discord/boot", { recursive: true })

    DebugPrint("Copying " + process.env.APPDATA+`\\discordmodtool\\${foldname}\\boot to .\\discord\\boot`)
    morefs.copyFolderRecursiveSync(process.env.APPDATA+`\\discordmodtool\\${foldname}\\boot`, ".\\discord")

    console.clear()
    console.log(colors.green("Finished restoring!"))
    return true
}

function RestoreVanilla() { 
    console.clear()
    console.log(colors.cyan("Getting in contact with github repo.") + colors.red(" This may take a while depending on your internet speed + disk speed."));
                
    let Current = path.basename(helper.GetApp())
    let url = `https://vanillaasars.000webhostapp.com/asar/`
    DebugPrint(Current)
    DebugPrint(url)

    let name = "temp-"+Date.now()
    DebugPrint(name)
    
    fs.mkdirSync("./"+name); DebugPrint("Created folder "+path.resolve("./"+name))
    const core = fs.createWriteStream("./"+name+"/core.asar", 'binary'); DebugPrint("Created core.asar")
    const app = fs.createWriteStream("./"+name+"/app.asar", 'binary'); DebugPrint("Created app.asar")
    DebugPrint("Created write sttreams.")

    DebugPrint("Pre-Call")
    axios({method: 'get',url: `${url}/core.asar`})
        .then(function (response) {
            DebugPrint("Got response (core). Writing...")
            console.log(response.data)
            core.pipe(response.data);
            core.close();
            console.log(colors.green("Finished downloading core.asar!") + colors.cyan(" Now installing app.asar..."))

            axios({method: 'get',url: `${url}/app.asar`})
                .then(function (response2) {
                    DebugPrint("Got response (app). Writing...")
                    app.pipe(response2.data);
                    app.close();
                    console.log(colors.green("Finished downloading app.asar!") + colors.cyan(" Now extracting vanilla files..."))

                    fs.mkdirSync("./"+name+"/extraction"); DebugPrint("Created folder "+path.resolve("./"+name+"/extraction"))
                    fs.mkdirSync("./"+name+"/extraction/core"); DebugPrint("Created folder "+path.resolve("./"+name+"/extraction/core"))
                    fs.mkdirSync("./"+name+"/extraction/app"); DebugPrint("Created folder "+path.resolve("./"+name+"/extraction/app"))

                    DebugPrint("Extracting core.asar")
                    asar.extractFile("./"+name+"/core.asar", "./"+name+"/extraction/"); DebugPrint("Extracted core.asar")
                    asar.extractFile("./"+name+"/app.asar", "./"+name+"/extraction/"); DebugPrint("Extracted app.asar")
                })
                .catch(function (error) {
                    console.log(error);
                })
        })
        .catch(function (error) {
            console.log(error);
        });

}

function Delete() {

    let del = false
    
    if(fs.existsSync("./discord")) {
        console.clear()
        console.log(colors.red("Deleting extraction folder..."))

        DebugPrint("Deleting ./discord...")
        fs.rmSync("./discord", { recursive: true })
        
        DebugPrint("Deleted ./discord.")

        del = true
    }

    console.clear()
    return del
}

function Main() {
    rl.question(colors.underline(">")+" ", (response) => {
        response = response.toLowerCase()

        switch(response) {
            case "e" || "extract":
                let eresp = Extract()
                if (eresp) { console.log(colors.green("Extraction complete! extracted to ./discord")) } else { 
                    console.log(colors.red("Failed to create folder ./discord | Folder already exists! Please use delete to reset."))
                }
                helper.startOut()
                Main()
                break
            case "p" || "patch":
                let presp = Patch()
                if (presp) { console.log(colors.green("Patch complete! Discord has been restarted if it was open.")) }
                //helper.startOut()
                //Main()
                break
            case "b" || "backup":
                let bresp = Backup()
                if (bresp) { console.log(colors.green("Backup complete!")) }
                helper.startOut()
                Main()
                break
            case "r" || "restore":
                let rresp = Restore("backup")
                if (rresp) { console.log(colors.green("Restore complete!")) }
                helper.startOut()
                Main()
                break
            case "v" || "vrestore":
                let vresp = RestoreVanilla("backup-vanilla")
                //if (vresp) { console.log(colors.green("Vanilla Restore complete!")) }
                //helper.startOut()
                //Main()
                break
            case "d" || "delete":
                let dresp = Delete()
                if (dresp) { console.log(colors.green("Deletion complete!")) } else { 
                    console.log(colors.red("Looks like there arent any folders to delete!"))
                }
                helper.startOut()
                Main()
                break
            default:
                console.clear()
                console.log(colors.red("Invalid command " + response + "!"))
                helper.startOut()
                Main()
                return false
        }
    })
}

// Main

let appdataexists = BetterMkdir(process.env.APPDATA+"\\discordmodtool")
if(advanced){ process.title = "Discord Mod Tool (ADVANCED MODE)" } else { process.title = "Discord Mod Tool"}

console.clear()
helper.startOut()
Main()