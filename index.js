const axios = require('axios').default;
require('dotenv').config()

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
