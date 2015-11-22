var images = new Array();
var parts = new Array();
var body;

function init() {
  images = document.querySelectorAll('.post img')
  var posts = document.querySelectorAll('.post-body')
  // Do this on scroll as well
  for (var i = 0; i < posts.length; i++) {
    setStickyImageValues(posts[i].querySelectorAll('img'));
  }
  setStickyValues(posts);


  // For color blending on scroll
  parts = document.querySelectorAll('.part');
  setStickyValues(parts);
  setColorValues(parts, true);

  var initScrollEvent = new Event("optimizedScroll")
  window.dispatchEvent(initScrollEvent);

  body = document.querySelector("body");

  body.classList.remove("preload");
}

// Mozilla throttle approach to events
// https://developer.mozilla.org/en-US/docs/Web/Events/scroll
;(function() {
    var throttle = function(type, name, obj) {
        var obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
            requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle ("scroll", "optimizedScroll");
})();

// handle event
window.addEventListener("optimizedScroll", function() {
  calculateImageState();
  calculateBackgroundColor();
});

function calculateImageState() {
  var scrolledTop = getScrolledLength()
  var windowHeight = getWindowHeight();

  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    // Three cases:
    // 1. The image is above middle of the page, not fixed
    // 2. The middle of the image is below the middle of the page and the
    //    bottom of the image is not lower than the parent, fixed
    // 3. The middle of the image is below the middle of the page and the
    //    bottom of the image is lower or equal than the parents bottom,
    //    position absolute parents bottom: 0

    // Needed:
    // Image middle (top + height/2)
    var imageTop = parseInt(image.dataset.originalPosition);
    var imageHeight = parseInt(image.dataset.originalHeight);
    var imageMiddle = (imageTop + (imageHeight/2));
    var imageIndex = parseInt(image.dataset.parentIndex);
    // Image bottom (top + height)
    var imageBottom = imageTop + imageHeight;
    // Scrolled length CHECKED
    // Parents bottom (top + height)
    var parentTop = parseInt(image.parentNode.parentNode.dataset.originalPosition);
    var parentHeight = parseInt(image.parentNode.parentNode.dataset.originalHeight);
    var parentBottom = parentTop + parentHeight;

    var imageOffsetOnSticky = (windowHeight - imageHeight)/2

    if ((scrolledTop + windowHeight/2) >= imageMiddle) {
      image.classList.add('fixed');
      image.style.top = (windowHeight - imageHeight)/2 + "px";
      showMidMarker();
    }
    else {
      image.classList.remove('fixed');
      image.style.top = "";
      hideMidMarker();
    }

    var imageBottomPosition = parentTop + parentHeight - imageHeight/2;
    if ((scrolledTop + windowHeight/2) >= imageBottomPosition) {
      image.classList.add('absolute');
      image.style.top = "";
    }
    else {
      image.classList.remove('absolute');
    }

    // (Next, change image depending on where in the article the middle of the page is)
    var imageStartVisibility = parseInt(image.dataset.startVisibility);
    var imageEndVisibility = image.dataset.endVisibility === "undefined" ? undefined : parseInt(image.dataset.endVisibility);
    var prevImageEndVisibility = images[i - 1] ? parseInt(images[i - 1].dataset.endVisibility) : undefined;
    var nextImageStartVisibility = images[i + 1] ? parseInt(images[i + 1].dataset.startVisibility) : undefined;
    var prevImageIndex = images[i - 1] ? parseInt(images[i - 1].dataset.parentIndex) : undefined;
    var nextImageIndex = images[i + 1] ? parseInt(images[i + 1].dataset.parentIndex) : undefined;

    // if scrollPosition is between startVisibility and endVisibility show that image
    if (scrolledTop >= imageStartVisibility && imageEndVisibility && scrolledTop <= imageEndVisibility) {
      showImage(image);
    }
    else {
      //  if scrollPosition is smaller then startVisibility:
      if (scrolledTop < imageStartVisibility && prevImageEndVisibility < scrolledTop) {
        showImage(image);
      }
      else if (!imageEndVisibility && scrolledTop > prevImageEndVisibility) {
        showImage(image);
      }
      else {
        hideImage(image);
      }
      //   check previous if
      //   it's endVisibility is bigger then scrollPosition, if not:
      //   check wich one is closest to scrollPosition and show that image
      //
      //  else if scrollPosition is bigger then endVisibility:
      //   check next if it's startVisibility is smaller then scrollPosition,
      //   if not: check wich one is closest to scrollPosition and show that image
      // Check start and end visibility, if it does not match check which one
      // is the closest
    }
    //
    //
    /*if ((rect.top + rect.height/2) < bodyRect.height/2 && rect.top >= parentRect.top && rect.bottom < parentRect.bottom) {
      images[i].classList.add('fixed')
      images[i].style.top = (rect.top > 0 ? rect.top : 0) + "px"
    }
    else {
      images[i].classList.remove('fixed')

    }*/
  }
}

function calculateBackgroundColor() {
  var scrolledTop = getScrolledLength();
  var windowHeight = getWindowHeight();
  var scrolledMid = scrolledTop + (windowHeight/2);
  var fadeWindowSize = 4;
  var fadeSize = windowHeight/fadeWindowSize;

  var color;

  // Get current scrolled length
  // Find the part in the scrolled area
  // Check if the one before is closer than windowHeight/6
  //    if no one before, set color to part color
  // Check if the one after is closer than (windowHeight/6)*5
  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];

    var partTop = parseInt(part.dataset.originalPosition);
    var partHeight = parseInt(part.dataset.originalHeight);
    var partEnd = partTop + partHeight;

    // there is only one part to care about
    //if (scrolledTop > partTop + windowHeight/fadeWindowSize && scrolledTop < (partTop + partHeight) - (windowHeight/fadeWindowSize)) {
    //  color = part.dataset.backgroundColor;
    //}
    //else {
      // If part-1
    //}

    // Top part
    if (scrolledMid < (partEnd - fadeSize) && i < 1) {
      color = part.dataset.backgroundColor;
    }
    // End part
    else if ((scrolledTop + fadeSize) > partTop && i == parts.length-1) {
      color = part.dataset.backgroundColor;
    }
    else {
      if ((scrolledMid - fadeSize) < partTop && (scrolledMid + fadeSize) > partTop && parts[i - 1]) {

        var percentage = ((fadeSize*2) - (scrolledMid-(partTop - fadeSize)))/((fadeSize)*2);
        //percentage = Math.abs(percentage - 1);
        //console.log(percentage);
        color = blender(part.dataset.backgroundColor, parts[i - 1].dataset.backgroundColor, percentage)
      }
      /*else if ((scrolledMid - fadeSize) < partEnd && (scrolledMid + fadeSize) > partEnd && parts[i - 1]) {
        var percentage = (partEnd - scrolledMid) / ((fadeSize));
        color = blender(part.dataset.backgroundColor, parts[i - 1].dataset.backgroundColor, percentage)
      }*/
      else if (scrolledMid < (partEnd - fadeSize) && scrolledMid > (partTop + fadeSize)) {
        color = part.dataset.backgroundColor;
      }
    }
  }
  setBackgroundColor(document.querySelector('body'), color);
}

function showImage(image) {
  image.classList.add("visible")
}
function hideImage(image) {
  image.classList.remove("visible")
}
function showMidMarker() {

}
function hideMidMarker() {

}
function setStickyValues(objects) {
  for (var i = 0; i < objects.length; i++) {
    var rect = objects[i].getBoundingClientRect();
    rect.offsetTop = getOffset(objects[i])
    objects[i].setAttribute('data-original-height', rect.height);
    objects[i].setAttribute('data-original-position', rect.offsetTop);
  }
}
function setStickyImageValues(images) {
  setStickyValues(images)
  for (var i = 0; i < images.length; i++) {
    var index = i;
    images[i].setAttribute('data-parent-index', index);

    var windowHeight = getWindowHeight();
    var rect = images[i].getBoundingClientRect();
    rect.offsetTop = getOffset(images[i])

    // parentNode is the p that encapsules the image
    var parentRect = images[i].parentNode.getBoundingClientRect();
    parentRect.offsetTop = getOffset(images[i].parentNode)

    // If first image in post, start visibility = 0
    if (index === 0) {
      images[i].setAttribute('data-start-visibility', 0);
    }
    else {
      images[i].setAttribute('data-start-visibility', (parentRect.offsetTop - windowHeight/2 - rect.height/2));
    }
    // If last image in post, end visibility = undefined (there is no end)
    if (!images[i+1]) {
      images[i].setAttribute('data-end-visibility', "undefined");
    }
    else {
      images[i].setAttribute('data-end-visibility', parentRect.offsetTop + (parentRect.height - windowHeight/2 + rect.height/2));
    }
  }
}

function setColorValues(objects, setTransparent) {
  for (var i = 0; i < objects.length; i++) {
    objects[i].setAttribute('data-background-color', rgbToHex(getBackgroundColor(objects[i])));
    if (setTransparent) {
      setBackgroundColor(objects[i], "transparent");
    }
  }
}


function getOffset(element) {
    if(typeof element.offsetParent !== 'undefined') {
        var curtop = 0;
        do {
            curtop += element.offsetTop;
        } while (element = element.offsetParent);

        return curtop;
    } else {
        return element.y;
    }
}
function getScrolledLength() {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}
function getWindowHeight() {
  return window.innerHeight;
}

// Color fading functions
function setBackgroundColor(element, color) {
  if (color === "transparent")
    element.style.backgroundColor = color;
  else
    element.style.backgroundColor = "#" + color;
}
function getBackgroundColor(element) {
  return element.style.backgroundColor ? element.style.backgroundColor : element.style.background || window.getComputedStyle(element, null).getPropertyValue("background-color");
}

function rgbToHex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ?
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function blender(c1, c2, amount) {
  var r = amount;

  // Combining
  function n(c) {
      var t = Math.round(c).toString(16);
      return t.length === 1 ? "0" + t : t
  }

  // Separating color and converting to base 10
  function a(c) {
      return [parseInt(c[0] + c[1], 16), parseInt(c[2] + c[3], 16), parseInt(c[4] + c[5], 16)]
  }

  var o = a(c1);
  var i = a(c2);
  var u = [(1 - r) * o[0] + r * i[0], (1 - r) * o[1] + r * i[1], (1 - r) * o[2] + r * i[2]];
  return n(u[0]) + n(u[1]) + n(u[2])
}
