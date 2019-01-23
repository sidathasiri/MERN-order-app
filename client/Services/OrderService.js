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

  getOrderById: function(orderId) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url: `/getOrder/${orderId}`,
        headers: { Authorization: `Bearer ${localStorage.authToken}` }
      })
        .then(response => {
          resolve(response.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  deleteOrder: function(orderId) {
    return new Promise((resolve, reject) => {
      axios
        .delete("/deleteOrder/" + orderId, {
          headers: { Authorization: `Bearer ${localStorage.authToken}` }
        })
        .then(response => {
          if (response.status == 200) {
            resolve(true);
          } else {
            reject("Error occurred in delete");
          }
        })
        .catch(err => reject(err));
    });
  },

  addOrder: function(order) {
    return new Promise((resolve, reject) => {
      axios("/addOrder", {
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.authToken}`
        },
        data: order
      })
        .then(function(response) {
          if (response.status == 200) {
            resolve(true);
          }
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  updateOrder: function(order) {
    return new Promise((resolve, reject) => {
      axios("/updateOrder", {
        method: "put",
        headers: {
          Authorization: `Bearer ${localStorage.authToken}`
        },
        data: {
          order
        }
      })
        .then(function(response) {
          if (response.status == 200) {
            resolve(true);
          }
        })
        .catch(function(error) {
          reject(error);
        });
    });
  }
};
