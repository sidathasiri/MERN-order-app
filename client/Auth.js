var axios = require("axios");
var isAuthorized = false;

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
            isAuthorized = true;
            resolve(isAuthorized);
          } else {
            isAuthorized = false;
            reject("Wrong username or Password");
          }
        })
        .catch(function(error) {
          isAuthorized = false;
          console.log(error);
          reject(error);
        });
    });
  },

  logout: () => {
    isAuthorized = false;
    localStorage.removeItem("authToken");
  },

  register: (email, password) => {
    axios
      .post("/register", {
        email: email,
        password: password
      })
      .then(function(response) {
        const { error, user } = response.data;
        if (error) {
          alert(error);
          isAuthorized = false;
        } else {
          alert("Register succesful!");
        }
      })
      .catch(function(error) {
        console.log(error);
        isAuthorized = false;
      });
  },
  isAuthorized: () => {
    return isAuthorized || localStorage.authToken;
  }
};
