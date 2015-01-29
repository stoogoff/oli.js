var elm = require("./element");

// block level elements
exports.h1 = new elm.Element("<h1>", "</h1>\n");
exports.h2 = new elm.Element("<h2>", "</h2>\n");
exports.h3 = new elm.Element("<h3>", "</h3>\n");
exports.h4 = new elm.Element("<h4>", "</h4>\n");
exports.h5 = new elm.Element("<h5>", "</h5>\n");
exports.h6 = new elm.Element("<h6>", "</h6>\n");
exports.p = new elm.Element("<p>", "</p>\n");
exports.blockquote = new elm.Element("<blockquote>", "</blockquote>\n");
exports.list = function(ordered) {
    return ordered ? new elm.Element("<ol>\n", "</ol>\n") : new elm.Element("<ul>\n", "</ul>\n");
};
exports.li = function() {
    return new elm.Element("<li>", "</li>\n");
};

// inline elements
exports.bold = new elm.Element("<strong>", "</strong>");
exports.italic = new elm.Element("<em>", "</em>");
exports.a = function (href) {
	return new elm.Element("<a href='" + href + "'>", "</a>");
};
exports.img = function (element) {
	var contentType = element.contentType;
	var altText = element.altText || "Embedded Image";
	var data = element.read("base64");

	return new elm.Element("<img alt='" + altText + "' src='data:" + contentType + ";base64," + data._settledValue + "' />", "");
};
exports.br = new elm.Element("<br />\n");

// checks
exports.isList = function(element) {
	return element.open() == "<li>";
}