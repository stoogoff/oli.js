var elm = require("./element");

// block elements
exports.h1 = new elm.Element("# ", "\n\n");
exports.h2 = new elm.Element("## ", "\n\n");
exports.h3 = new elm.Element("### ", "\n\n");
exports.h4 = new elm.Element("#### ", "\n\n");
exports.h5 = new elm.Element("##### ", "\n\n");
exports.h6 = new elm.Element("###### ", "\n\n");
exports.p = new elm.Element("", "\n\n");
exports.blockquote = new elm.Element("> ", "\n\n");
exports.list = function() {
    return new elm.Element("\n", "");
}
exports.li = function(indent, index) {
    indent = elm.tab(parseInt(indent, 10));

    if(index !== null)
        return new elm.Element(indent + index + ". ", "\n");
    else
        return new elm.Element(indent + "- ", "\n");
};

// inline elements
exports.bold = new elm.Element("**");
exports.italic = new elm.Element("*");
exports.a = function (href) {
	return new elm.Element("[", "](" + href + ")");
};
exports.img = function (element) {
	var contentType = element.contentType;
	var altText = element.altText || "Embedded Image";
	var data = element.read("base64");

	return new elm.Element("![" + altText + "](data:" + contentType + ";base64," + data._settledValue + ")", "");
};
exports.br = new elm.Element("", "  \n");

// checks
exports.isList = function(element) {
	return element.open().match(/^\t*(\d\.|-)\s$/);
}