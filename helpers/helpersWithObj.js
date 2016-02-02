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
  handlebars.registerHelper('rightLink', function(url) {
        var result = "";

        if (url) {
            if (url.indexOf("http") !== -1 && url.indexOf("stories") !== -1) {
            }
            else {
              url = "http://" + url;
            }

            if (url.indexOf("linkedin") !== -1) {
              result = "<a class='linkedin-link' href='" + url + "'>Read about it on my LinkedIn</a>";
            }
            else if (url.indexOf("stories") !== -1) {
              result = "<a class='' href='#stories'>Read the story further below</a>";
            }
            else {
              result = "<a href='" + url + "'>See the project</a>";
            }
        }

        return new handlebars.SafeString(result);
    });
}
