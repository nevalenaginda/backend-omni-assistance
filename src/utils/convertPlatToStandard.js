exports.convertPlatToStandard = (plat) => {
    return plat.split(" ").join("").toUpperCase()
}