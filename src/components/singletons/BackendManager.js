class BackendManager {
  constructor() {
    this.domain = "https://api.mypokadot.com/pp/"
    this.refreshToken = "";
    this.token = "";
  }

  isExpired() {
    var cachedData = localStorage.getItem('user');
    var date = cachedData.expiration;
    var currentDate = new Date();
    if (!cachedData || currentDate.setSeconds(currentDate.getSeconds() + 5*60*60) >= date) {
      return true;
    } else {
      this.token = cachedData.token;
      console.log(cachedData.token);
      return false;
    }
  }

  updateToken() {
    return fetch('https://api.mypokadot.com/pp/users/refresh', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: this.refreshToken
      })
    })
    .then((resp) => resp.json()) // Transform the data into json
    .then(data => {
      this.token = data.token;
      localStorage.setItem('token', data.token);
      var date = new Date();
      date.setSeconds(date.getSeconds() + data.expires_in);
      localStorage.setItem('expiration', date);
      return data;
    })
  }

  makeQuery(query, body) {
    return fetch(this.domain + query, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      },
      body: body
    })
    .then((resp) => resp.json())
    .then(data => {
      console.log(data);
      return data;
    })
  }
}

export default (new BackendManager);
