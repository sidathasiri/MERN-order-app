var axios = require("axios");

module.exports = {
  login: (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/login", {
          email: email,
          password: password
        })
        .then(response => {
          const token = response.data.token;
          if (token) {
            localStorage.authToken = token;
            resolve(isAuthorized);
          } else {
            reject("Wrong username or Password");
          }
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },

  register: (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/register", {
          email: email,
          password: password
        })
        .then(function(response) {
          const { error, token } = response.data;
          if (error) {
            reject(error);
            isAuthorized = false;
          } else {
            localStorage.authToken = token;
            resolve(isAuthorized);
          }
        })
        .catch(function(error) {
          reject(error);
        });
    });
  },
  isAuthorized: () => {
    return localStorage.authToken;
  }
};
