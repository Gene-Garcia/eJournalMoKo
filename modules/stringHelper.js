
exports.isEmpty = (s) => {
    if (s == undefined) return true;
    else if (s == null) return true;
    else if (s == "") return true;

    return false;
};