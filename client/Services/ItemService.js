var axios = require("axios");

module.exports = {
  getItems: function() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: "/getItems",
        headers: { Authorization: `Bearer ${localStorage.authToken}` }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => reject(err));
    });
  }
};
