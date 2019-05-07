class BackendManager {
  constructor() {
    // this.domain = "https://api.mypokadot.com/pp/"
    this.domain = "http://localhost:8080/pp/"
    // this.fileUrl = "https://s3-us-west-2.amazonaws.com/openmic-files/"
    this.fileUrl = "https://s3-us-west-2.amazonaws.com/openmic-test/"
    this.gifUrl = "https://s3-us-west-2.amazonaws.com/openmic-gifs/"
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
      return false;
    }
  }

  updateToken() {
    return fetch(this.domain + 'users/refresh', {
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

  fetch(query, body) {
    return fetch(query, {
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
      return data;
    })
  }
}

export default (new BackendManager);
