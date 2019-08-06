class UtilsManager {

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
      return "00:" + secondsString;
    } else if (d < 3600) {
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

  buildHierarchy(arry, rootId) {
    var roots = [], children = {};
    // find the top level nodes and hash the children based on parent
    for (var i = 0, len = arry.length; i < len; ++i) {
      var item = arry[i],
        p = item.parent_comment_id,
        target = (p == rootId) ? roots : (children[p] || (children[p] = []));
        target.push(item);
    }

    // function to recursively build the tree
    var findChildren = function(parent) {
      if (children[parent.id]) {
        parent.children = children[parent.id];
        for (var i = 0, len = parent.children.length; i < len; ++i) {
          findChildren(parent.children[i]);
        }
      }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
      findChildren(roots[i]);
    }

    console.log(roots);
    return roots;
  }
}

export default (new UtilsManager);
