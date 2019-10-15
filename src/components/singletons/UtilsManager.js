class UtilsManager {

  msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
  }

  convertToCommaString(x) {
    if (x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return ("0");
    }
  }

  convertToDollars(cents) {
    var dollars = cents / 100;
    return dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
  }

  createMinString(d) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.ceil(d % 3600 % 60);

    var secondsString = "" + s;
    if (s < 10) {
      secondsString = "0" + s;
    } else if (s == 60) {
      secondsString = "00";
      m += 1;      
    }

    var minutesString = "" + m;
    if (m < 10) {
      minutesString = "0" + m;
    } else if (m == 60) {
      minutesString = "00";
      h += 1;
    }

    var hourString = "" + h;
    if (h < 10) {
      hourString = "0" + h;
    } else if (h == 60) {
      hourString = "00";
    }

    if (d < 3600) {
      return minutesString + ":" + secondsString;
    } else {
      return hourString + ":" + minutesString + ":" + secondsString;
    }
  }

  createTimeString(d) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = (d % 3600 % 60).toFixed(2);

    var secondsString = "" + s;
    if (s < 10) {
      secondsString = "0" + s;
    }

    var minutesString = "" + m;
    if (m < 10) {
      minutesString = "0" + m;
    }

    var hourString = "" + h;
    if (h < 10) {
      hourString = "0" + h;
    }

    if (d < 60) {
      return secondsString;
    } else if (d < 3600) {
      return minutesString + ":" + secondsString;
    } else {
      return hourString + ":" + minutesString + ":" + secondsString;
    }
  }

  createNumberString(num) {
    var si = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "k" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
      if (num >= si[i].value) {
        break;
      }
    }
    return (num / si[i].value).toFixed(1).replace(rx, "$1") + si[i].symbol;
  }

  base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
  }
}

export default (new UtilsManager);
