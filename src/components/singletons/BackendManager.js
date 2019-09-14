class BackendManager {
  constructor() {
    // this.domain = "https://api.mypokadot.com/pp/";
    this.domain = "http://localhost:8080/";

    this.searchDomain = "https://listen-api.listennotes.com/api/v2/search?q=";
    this.episodesDomain = "https://listen-api.listennotes.com/api/v2/podcasts/";
    this.episodeDomain = "https://listen-api.listennotes.com/api/v2/episodes/";

    // this.fileUrl = "https://s3-us-west-2.amazonaws.com/openmic-files/";
    this.fileUrl = "https://s3-us-west-2.amazonaws.com/openmic-test/";
    // this.fileUrl = "https://s3-us-west-2.amazonaws.com/riptide-clips/";
    // this.gifUrl = "https://s3-us-west-2.amazonaws.com/openmic-test/";
    this.gifUrl = "https://s3-us-west-2.amazonaws.com/riptide-gifs/";
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

  makeOutsideQuery(query, body, token) {
    return fetch(query, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
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

  searchPodcast(podcast, offset) {
    return fetch(this.searchDomain + podcast + '&type=podcast&offset=' + offset, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-ListenAPI-Key': 'db265fdaafa944b8b856a2d4a20466f9',
      },
    })
    .then((resp) => resp.json())
    .then(data => {
      return data;
    });
  }

  getEpisodes(podcastId, pubDate) {
    var query = this.episodesDomain + podcastId;
    if (pubDate) {
      query += "?next_episode_pub_date=" + pubDate + "&sort=recent_first";
    } else {
      query += "?sort=recent_first";
    }
    return fetch(query, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-ListenAPI-Key': 'db265fdaafa944b8b856a2d4a20466f9',
      },
    })
    .then((resp) => resp.json())
    .then(data => {
      return data;
    });
  }

  getEpisode(episodeId) {
    var query = this.episodeDomain + episodeId;
    return fetch(query, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-ListenAPI-Key': 'db265fdaafa944b8b856a2d4a20466f9',
      },
    })
    .then((resp) => resp.json())
    .then(data => {
      return data;
    });
  }
}

export default (new BackendManager);
