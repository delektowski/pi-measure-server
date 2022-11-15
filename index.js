const BME280 = require("bme280-sensor");
const axios = require("axios").default;
const handlePhoto = require("./handlePhoto");
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
        saveMeasurements(sensorData.temperature, sensorData.humidity, sensorData.pressure, sensorData.measurementDate)
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
    })
    .catch((err) => console.error(`BME280 initialization failed: ${err} `));



function saveMeasurements(temperature, humidity, pressure, measurementDate) {
    measurementDate = new Date(measurementDate).getTime()/1000
    axios({
        url: process.env.GQL_URL,
        method: 'post',
        data: {
            query: `mutation {
                          saveMeasurements(temperature: ${temperature}, humidity:${humidity}, pressure: ${pressure}, measurementDate:${measurementDate}) {
                                                        code
                                                        message
                                                      }
                          }
      `
        }
    }).then((result) => {
        console.log(result.data.data)
    }).catch(err => {
        console.log("err", err.response.data)
    });
}

setInterval(readSensorData, 1800000)
handlePhoto()
