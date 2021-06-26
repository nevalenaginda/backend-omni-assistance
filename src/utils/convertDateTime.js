exports.convertDateTime = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit'
    }).split("/").join("-").split(",").join("")
}