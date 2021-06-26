exports.calculateTotalPayment = (tanggalMasuk, tanggalKeluar, tipe) => {
    //hitung jumlah jam
    const jam = Math.ceil(Math.abs(new Date(tanggalKeluar) - new Date(tanggalMasuk)) / 3600000);
    const biaya = tipe === "suv" ? 25000 : 35000
    const totalBayar = jam > 1 ? biaya + ((jam - 1) * biaya * 0.2) : biaya
    console.log(jam)
    console.log(biaya)
    return totalBayar
}