const mParkingLot = require("../models/mParkingLot")
const {
    convertDateTime
} = require("../utils/convertDateTime")
const {
    calculateTotalPayment
} = require("../utils/calculateTotalPayment")
const {
    convertPlatToStandard
} = require("../utils/convertPlatToStandard")

module.exports = {
    register: async (req, res) => {
        try {
            const existCars = await mParkingLot.readData()
            let availableLot = await mParkingLot.readAvailableLot()
            let usedLot = await mParkingLot.readUsedLot()
            const {
                plat_nomor,
                warna,
                tipe
            } = req.body

            if (!plat_nomor || !warna || !tipe) {
                const response = {
                    status: 401,
                    message: "Registrasi parkir gagal",
                    error: "Data tidak lengkap",
                    data: null
                }
                return res.status(401).json(response)
            }

            if (availableLot.length < 1) {
                const response = {
                    status: 404,
                    message: "Registrasi parkir gagal",
                    error: "Slot parkir sudah penuh",
                    data: null
                }
                return res.status(404).json(response)
            }


            if (tipe.toLowerCase() === "suv" || tipe.toLowerCase() === "mpv") {
                const findExist = existCars.find(car => convertPlatToStandard(car.plat_nomor) === convertPlatToStandard(plat_nomor))
                if (findExist) {
                    const response = {
                        status: 409,
                        message: "Registrasi parkir gagal",
                        error: "Plat nomor sudah terdata. Masukkan plat nomor dengan benar.",
                        data: null
                    }
                    return res.status(409).json(response)
                }

                const parking_lot = availableLot[0]
                const filterAvailableLot = availableLot.filter(lot => lot !== parking_lot)
                usedLot.push(parking_lot)
                let tanggal_masuk = new Date();
                carData = {
                    plat_nomor,
                    warna,
                    tipe,
                    tanggal_masuk,
                    parking_lot
                }
                existCars.push(carData)

                mParkingLot.saveData(existCars).then(async () => {
                    try {
                        await mParkingLot.saveUsedLot(usedLot)
                        await mParkingLot.saveAvailableLot(filterAvailableLot)
                        const response = {
                            status: 201,
                            message: "Registrasi parkir sukses",
                            error: null,
                            data: {
                                plat_nomor,
                                parking_lot,
                                tanggal_masuk: convertDateTime(tanggal_masuk)
                            }
                        }
                        res.status(201).json(response)
                    } catch (err) {
                        const response = {
                            status: 500,
                            message: "Registrasi parkir gagal",
                            error: err.message,
                            data: null
                        }
                        return res.status(500).json(response)
                    }

                }).catch((err) => {
                    const response = {
                        status: 500,
                        message: "Registrasi parkir gagal",
                        error: err.message,
                        data: null
                    }
                    return res.status(500).json(response)
                });
            } else {
                const response = {
                    status: 409,
                    message: "Registrasi parkir gagal",
                    error: "Tipe mobil tidak benar. Tipe mobil harus SUV atau MPV.",
                    data: null
                }
                return res.status(409).json(response)
            }

        } catch (err) {
            const response = {
                status: 500,
                message: "Registrasi parkir gagal",
                error: err.message,
                data: null
            }
            return res.status(500).json(response)
        }
    },
    exit: async (req, res) => {
        try {
            const {
                plat_nomor
            } = req.body
            if (!plat_nomor) {
                const response = {
                    status: 401,
                    message: "Verifikasi keluar parkir gagal",
                    error: "Plat nomor harus diisi",
                    data: null
                }
                return res.status(401).json(response)
            }

            const existCars = await mParkingLot.readData()
            let availableLot = await mParkingLot.readAvailableLot()
            let usedLot = await mParkingLot.readUsedLot()
            // console.log(existCars)
            const findExist = existCars.find(car => convertPlatToStandard(car.plat_nomor) === convertPlatToStandard(plat_nomor))
            // console.log(findExist)
            if (findExist) {
                const filterCars = existCars.filter(car => convertPlatToStandard(car.plat_nomor) !== convertPlatToStandard(plat_nomor))
                // console.log(filterCars)
                mParkingLot.saveData(filterCars).then(async () => {
                    try {
                        let history = await mParkingLot.readHistory()
                        // console.log(history)
                        let data = findExist
                        const tanggal_keluar = new Date();
                        const jumlah_bayar = calculateTotalPayment(data.tanggal_masuk, tanggal_keluar, data.tipe.toLowerCase())
                        data = {
                            ...data,
                            tanggal_keluar,
                            jumlah_bayar
                        }
                        history.push(data)
                        availableLot.push(data.parking_lot)
                        availableLot.sort()
                        let filterUsedLot = usedLot.filter(lot => lot !== data.parking_lot)
                        mParkingLot.saveHistory(history).then(async () => {
                            try {
                                await mParkingLot.saveUsedLot(filterUsedLot)
                                await mParkingLot.saveAvailableLot(availableLot)
                                const response = {
                                    status: 200,
                                    message: "Verifikasi keluar parkir sukses",
                                    error: null,
                                    data: {
                                        plat_nomor: data.plat_nomor,
                                        tanggal_masuk: convertDateTime(data.tanggal_masuk),
                                        tanggal_keluar: convertDateTime(data.tanggal_keluar),
                                        jumlah_bayar: data.jumlah_bayar
                                    }
                                }
                                return res.status(200).json(response)
                            } catch (err) {
                                const response = {
                                    status: 500,
                                    message: "Verifikasi keluar parkir gagal",
                                    error: err.message,
                                    data: null
                                }
                                return res.status(500).json(response)
                            }
                        }).catch((err) => {
                            const response = {
                                status: 500,
                                message: "Verifikasi keluar parkir gagal",
                                error: err.message,
                                data: null
                            }
                            return res.status(500).json(response)
                        })
                    } catch (err) {
                        const response = {
                            status: 500,
                            message: "Verifikasi keluar parkir gagal",
                            error: err.message,
                            data: null
                        }
                        return res.status(500).json(response)
                    }

                }).catch((err) => {
                    const response = {
                        status: 500,
                        message: "Verifikasi keluar parkir gagal",
                        error: err.message,
                        data: null
                    }
                    return res.status(500).json(response)
                })
            } else {
                const response = {
                    status: 404,
                    message: "Verifikasi keluar parkir gagal",
                    error: "Plat nomor tidak ditemukan",
                    data: null
                }
                return res.status(404).json(response)
            }
        } catch (err) {
            const response = {
                status: 500,
                message: "Verifikasi keluar parkir gagal",
                error: err.message,
                data: null
            }
            return res.status(500).json(response)
        }
    },
    countType: async (req, res) => {
        try {
            const {
                tipe
            } = req.body
            if (!tipe) {
                const response = {
                    status: 401,
                    message: "Gagal mendapatkan data",
                    error: "Tipe mobil harus diisi",
                    data: null
                }
                return res.status(401).json(response)
            }
            if (tipe.toLowerCase() === "suv" || tipe.toLowerCase() === "mpv") {
                const existCars = await mParkingLot.readData()
                const filter = existCars.filter(cars => cars.tipe.toLowerCase() === tipe.toLowerCase())
                const jumlah_kendaraan = filter.length
                const response = {
                    status: 200,
                    message: `Sukses mendapatkan data jumlah kendaraan tipe ${tipe}`,
                    error: null,
                    data: {
                        jumlah_kendaraan
                    }
                }
                return res.status(200).json(response)
            } else {
                const response = {
                    status: 409,
                    message: "Gagal mendapatkan data",
                    error: "Tipe mobil tidak benar. Tipe mobil harus SUV atau MPV.",
                    data: null
                }
                return res.status(409).json(response)
            }

        } catch (err) {
            const response = {
                status: 500,
                message: "Gagal mendapatkan data",
                error: err.message,
                data: null
            }
            return res.status(500).json(response)
        }
    },
    listByColor: async (req, res) => {
        const {
            warna
        } = req.body
        if (!warna) {
            const response = {
                status: 401,
                message: "Gagal mendapatkan data",
                error: "Warna mobil harus diisi",
                data: null
            }
            return res.status(401).json(response)
        }
        try {
            const existCars = await mParkingLot.readData()
            const filter = existCars.filter(cars => cars.warna.toLowerCase() === warna.toLowerCase()).map(car => car.plat_nomor)
            const response = {
                status: 200,
                message: `Sukses mendapatkan data list kendaraan warna ${warna}`,
                error: null,
                data: {
                    plat_nomor: filter
                }
            }
            return res.status(200).json(response)
        } catch (err) {
            const response = {
                status: 500,
                message: "Gagal mendapatkan data",
                error: err.message,
                data: null
            }
            return res.status(500).json(response)
        }
    },
    listUsedLot: async (req, res) => {
        try {
            const usedLot = await mParkingLot.readUsedLot()
            const response = {
                status: 200,
                message: `Sukses mendapatkan data list slot terpakai`,
                error: null,
                data: {
                    jumlah: usedLot.length,
                    slot_terpakai: usedLot
                }
            }
            return res.status(200).json(response)

        } catch (err) {
            const response = {
                status: 500,
                message: "Gagal mendapatkan data list slot terpakai",
                error: err.message,
                data: null
            }
            return res.status(500).json(response)
        }
    },
    listAvailableLot: async (req, res) => {
        try {
            const availableLot = await mParkingLot.readAvailableLot()
            const response = {
                status: 200,
                message: `Sukses mendapatkan data list slot tersedia`,
                error: null,
                data: {
                    jumlah: availableLot.length,
                    slot_terpakai: availableLot
                }
            }
            return res.status(200).json(response)

        } catch (err) {
            const response = {
                status: 500,
                message: "Gagal mendapatkan data list slot tersedia",
                error: err.message,
                data: null
            }
            return res.status(500).json(response)
        }
    }
}