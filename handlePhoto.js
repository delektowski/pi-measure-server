module.exports = async function handlePhoto() {
    const shell = require("shelljs");
    const dayjs = require("dayjs");
    require("dotenv").config();
    const axios = require("axios").default;
    const title = dayjs(new Date()).format("YYYY-MM-DD_THH:mm:ss");

    function makePhoto() {
        shell.exec(`raspistill -o /home/mardel/kod/pi-measure-server/pics/img-${title}.jpg -q 90 -w 640 -h 480`, function (code, stdout, stderr) {

                if (stderr) {
                    console.log("ERROR:", stderr);
                    makePhoto();
                    return;
                }
                storePhoto();
            }
        );
    }

    function storePhoto() {
        shell.exec(`scp /home/mardel/kod/pi-measure-server/pics/img-${title}.jpg ${process.env.PICS_SERVER}`, function (code, stdout, stderr) {

            if (stderr) {
                console.log("ERROR:", stderr);
                storePhoto();
                return;
            }
            console.log("Photo was sent: ", title);
            savePhotoData();
        });
    }

    function savePhotoData() {
        axios({
            url: process.env.GQL_URL,
            method: "post",
            data: {
                query: `mutation {
                          savePhotoData(title: "${title}") {
                                                           code
                                                           message
                                                      }
                          }
      `
            }
        }).then((result) => {
            console.log(result.data.data);
            removePhoto()
            setTimeout(handlePhoto, 10000);
        }).catch(err => {
            console.log("err", err.response.data);
            savePhotoData()
        });
    }

    function removePhoto() {
        shell.exec(`rm /home/mardel/kod/pi-measure-server/pics/img-${title}.jpg`, function (code, stdout, stderr) {

            if (stderr) {
                console.log("ERROR:", stderr);
                return;
            }
            console.log("Photo has been removed: ", title);
        });
    }

    makePhoto();
};

