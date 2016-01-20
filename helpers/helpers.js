module.exports = {
    math: function (lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);

      return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
      }[operator];
    },

    viktorsAge: function (text) {
        var birthday = new Date(1992, 3, 1);
        var today = new Date();
        return Math.floor(today.getFullYear() - birthday.getFullYear() - (birthday.getMonth() - today.getMonth())*0.01);
    },
    isSvg: function(imageUrl) {
      return imageUrl.indexOf(".svg") !== -1;
    }
};
