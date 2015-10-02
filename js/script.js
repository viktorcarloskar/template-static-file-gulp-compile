var images = new Array();

function init() {
  images = document.querySelectorAll('.post img')
  var posts = document.querySelectorAll('.post-body')
  // Do this on scroll as well
  for (var i = 0; i < posts.length; i++) {
    setStickyImageValues(posts[i].querySelectorAll('img'));
  }
  setStickyValues(posts)

  var initScrollEvent = new Event("optimizedScroll")
  window.dispatchEvent(initScrollEvent);
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
    }
    else {
      image.classList.remove('fixed');
      image.style.top = "";
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
      showImage(image)
    }
    else {
      if (scrolledTop < imageStartVisibility && prevImageEndVisibility < scrolledTop) {
        showImage(image)
      }
      else {
        hideImage(image)
      }
      //  if scrollPosition is smaller then startVisibility:
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
});

function showImage(image) {
  image.classList.add("visible")
}
function hideImage(image) {
  image.classList.remove("visible")
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

    // parentNode is the p that encapsules the image
    var parentRect = images[i].parentNode.getBoundingClientRect();
    parentRect.offsetTop = getOffset(images[i].parentNode)

    // If first image in post, start visibility = 0
    if (index === 0) {
      images[i].setAttribute('data-start-visibility', 0);
    }
    else {
      images[i].setAttribute('data-start-visibility', parentRect.offsetTop);
    }
    // If last image in post, end visibility = undefined (there is no end)
    if (!images[i+1]) {
      images[i].setAttribute('data-end-visibility', "undefined");
    }
    else {
      images[i].setAttribute('data-end-visibility', parentRect.offsetTop + parentRect.height);
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
