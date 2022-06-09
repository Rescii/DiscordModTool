exports.argshas = function(args, lookfor) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] == lookfor) {
            return true;
        }
    }
    return false;
}