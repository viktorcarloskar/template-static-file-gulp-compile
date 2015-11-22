(function(window){
    'use strict';

    function define_color_scroll() {
      var ColorScroll = {};

      function init(queryString) {

      }

      return ColorScroll;
    }

    if(typeof(ColorScroll) === 'undefined'){
        window.ColorScroll = define_color_scroll();
    }
    else{
        console.log("ColorScroll already defined.");
    }
})(window);
