'use babel';

import request from 'request'

module.exports =  {

  ms_services: function(url, content) {

    return new Promise((resolve, reject) => {
      request.post(
          {
            headers: {
              'content-type' : 'application/json',
              'Ocp-Apim-Subscription-Key' : ''
            },
            url: url,
            body: JSON.stringify(content)
          },
          function(err,response,body) {
              if (!err && response.statusCode == 200) {
                resolve(body)
              } else {
                reject({
                  reason: 'Unable to query!',
                  error: err
                  })
              }
          })
    })
  },

  sebis_services: function(url, content) {
    return new Promise((resolve, reject) => {
      request.post(
          {
            headers: {
              'content-type' : 'application/json',
            },
            url: url,
            body: JSON.stringify(content)
          },
          function(err,response,body) {
              if (!err && response.statusCode == 200) {
                resolve(body)
              } else {
                reject({
                  reason: 'Unable to query!',
                  error: err
                  })
              }
          })
    })
  }
}
