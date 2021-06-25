const mParkingLot = require("../models/mParkingLot")

module.exports = {
    register: async (req, res) => {
        try {
            const existCars = await mParkingLot.readData()

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


            if (tipe.toLowerCase() === "suv" || tipe.toLowerCase() === "mpv") {
                const findExist = existCars.find(car => car.plat_nomor === plat_nomor)
                if (findExist) {
                    const response = {
                        status: 409,
                        message: "Registrasi parkir gagal",
                        error: "Plat nomor sudah terdata. Masukkan plat nomor dengan benar.",
                        data: null
                    }
                    return res.status(409).json(response)
                }

                parking_lot = "A1"
                tanggal_masuk = new Date();
                carData = {
                    plat_nomor,
                    warna,
                    tipe,
                    tanggal_masuk,
                    parking_lot
                }
                existCars.push(carData)
                mParkingLot.saveData(existCars).then(() => {
                    const response = {
                        status: 201,
                        message: "Registrasi parkir sukses",
                        error: null,
                        data: {
                            plat_nomor,
                            parking_lot,
                            tanggal_masuk
                        }
                    }
                    res.status(201).json(response)
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
            console.log(existCars)
            const findExist = existCars.find(car => car.plat_nomor === plat_nomor)
            console.log(findExist)
            if (findExist) {
                const tanggal_keluar = new Date();
                const jumlah_bayar = "45000"
                const filterCars = existCars.filter(car => car.plat_nomor !== plat_nomor)
                console.log(filterCars)
                mParkingLot.saveData(filterCars).then(async () => {
                    try {
                        let history = await mParkingLot.readHistory()
                        console.log(history)
                        let data = findExist
                        data = {
                            ...data,
                            tanggal_keluar,
                            jumlah_bayar
                        }
                        history.push(data)
                        mParkingLot.saveHistory(history).then(() => {
                            const response = {
                                status: 200,
                                message: "Verifikasi keluar parkir sukses",
                                error: null,
                                data: {
                                    plat_nomor: data.plat_nomor,
                                    tanggal_masuk: data.tanggal_masuk,
                                    tanggal_keluar: data.tanggal_keluar,
                                    jumlah_bayar: data.jumlah_bayar
                                }
                            }
                            return res.status(200).json(response)
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
    }
}