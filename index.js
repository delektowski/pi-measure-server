
    const BME280 = require("bme280-sensor");
    const axios = require("axios");
    require('dotenv').config()

    // The BME280 constructor options are optional.
    const options = {
        i2cBusNo: 1, // defaults to 1
        i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS(), // defaults to 0x77
    };

    const bme280 = new BME280(options);

    // Read and save to db BME280 sensor data
    const readSensorData = async () => {
        try {
            const data = await bme280.readSensorData();
            let sensorData = {
                temperature: +(data && data.temperature_C),
                humidity: +(data && data.humidity),
                pressure: +(data && data.pressure_hPa),
                measurementDate: new Date(),
            };
            console.log("sensorData", sensorData)
        } catch (err) {
            console.log("Something went wrong: ", err);
        }
    };

    // Initialize the BME280 sensor and start making photos
    bme280
        .init()
        .then(() => {
            console.log("BME280 initialization succeeded");
            readSensorData();
            // setInterval(readSensorData, 1800000);
        })
        .catch((err) => console.error(`BME280 initialization failed: ${err} `));


const id = '12'
axios({
    url: process.env.GQL_URL,
    method: 'post',
    data: {
        query: `mutation {
                          piMeasurements(id: ${id}) {
                                                        code
                                                        message
                                                      }
                          }
      `
    }
}).then((result) => {
    console.log(result.data.data)
});
