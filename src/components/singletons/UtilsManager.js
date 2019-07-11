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

  createMinString(seconds) {
    var minutes = Math.floor(seconds/60);
    var remainingSeconds = seconds - minutes * 60;
    if (remainingSeconds < 10) {
      return minutes + ":0" + remainingSeconds;
    } else {
      return minutes + ":" + remainingSeconds;
    }
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
