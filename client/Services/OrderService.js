var axios = require("axios");

module.exports = {
  getOrders: function() {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: "/getOrders",
        headers: { Authorization: `Bearer ${localStorage.authToken}` }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },

  deleteOrder: function(orderId, orders) {
    return new Promise((resolve, reject) => {
      axios
        .delete("/deleteOrder/" + orderId, {
          headers: { Authorization: `Bearer ${localStorage.authToken}` }
        })
        .then(response => {
          if (response.status == 200) {
            let newArr = [];
            for (let i = 0; i < orders.length; i++) {
              if (orders[i]._id != orderId) {
                newArr.push(orders[i]);
              }
            }
            resolve(newArr);
          } else {
            reject("Error occurred in delete");
          }
        })
        .catch(err => reject(err));
    });
  }
};
