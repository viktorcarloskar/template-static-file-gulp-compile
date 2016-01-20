module.exports.register = function (handlebars) {
  handlebars.registerHelper('rightImageTag', function(url) {
        var result = "";

        if (url.indexOf(".svg") !== -1) {
          result = "<object data='" + url + "'></object>";
        }
        else {
          result = "<img src='" + url + "' alt='' />";
        }

        return new handlebars.SafeString(result);
    });
}
