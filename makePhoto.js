module.exports = async function makePhoto() {
  const shell = require("shelljs");
  const dayjs = require("dayjs");
  require('dotenv').config()
  const axios = require("axios").default;

  const title = dayjs(new Date()).format("YYYY-MM-DDTHH-mm-ss");

  function postPhotoSrc(title) {

    axios({
      url: process.env.GQL_URL,
      method: 'post',
      data: {
        query: `mutation {
                          savePhotoSrc(title: ${title}) {
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

  shell.exec(`raspistill -o /home/mardel/kod/pi-measure-server/pics/img-${title}.jpg -w 640 -h 480`);
  console.log("Photo was made: ", title);
  shell.exec(`scp /home/mardel/kod/pi-measure-server/pics/img-${title}.jpg ${process.env.PICS_SERVER}`);
  console.log("Photo was sent: ", title);
  setTimeout(makePhoto, 3000);
};
