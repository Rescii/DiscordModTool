let fs = require('fs');
let path = require("path")

exports.copyFileSync = copyFileSync;
exports.copyFolderRecursiveSync = copyFolderRecursiveSync;
exports.GetFileThatStartsWith = function(Path, Search) {
    var Found;

    for (let file of fs.readdirSync(Path).filter(fn => fn.startsWith('app-'))) {
        if (file.startsWith(Search)) {
            Found = Path + "\\" + file;
        }
    }

    return Found
};

function copyFileSync( source, target ) {

    var targetFile = target;

    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) { fs.mkdirSync( targetFolder ); }

    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) { copyFolderRecursiveSync( curSource, targetFolder ); } else { copyFileSync( curSource, targetFolder ); }
        } );
    }
}