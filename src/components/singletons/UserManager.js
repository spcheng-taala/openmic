class UserManager {
  constructor() {
    this.id = 0;
    this.firstName = "";
    this.lastName = "";
    this.username = "";
    this.bio = "";
    this.email = "";
    this.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJzZWFucGNoZW5nQGdtYWlsLmNvbSIsImZpcnN0X25hbWUiOiJTZWFuIiwibGFzdF9uYW1lIjoiQ2hlbmciLCJmYXZvcml0ZV90ZWFtX2lkIjpudWxsLCJjcmVhdGVkX2RhdGUiOiIyMDE3LTEyLTE2VDA3OjQxOjA1LjAwMFoiLCJpYXQiOjE1MTM4NTczMTQsImV4cCI6MTUxMzg3NTMxNH0.EurZ_201klx_xgNKWnQMpCHOIZsr72TktwTtVIcaMjA";
    this.currentStory = {
      id: -1,
      title: "Immigration and the wall",
      url: "https://s3-us-west-2.amazonaws.com/pokadotmedia/dylanbrody_1.mp3",
      user: {
        id: 1,
        first_name: "Dylan",
        last_name: "Brody",
        profile_picture: "https://s3-us-west-2.amazonaws.com/pokadotmedia/dylanbrody.jpg",
      },
    };
    this.funnyStories = []
    this.seriousStories = []
  }
}

export default (new UserManager);
