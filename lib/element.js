function Element(start, end) {
	if (end === undefined)
		end = start;

	this.open = function () {
		return start;
	};

	this.close = function () {
		return end;
	};

	this.isList = function () {
		return start.match(/^\t*(\d\.|-)\s$/);
	};
}

function tab(indent) {
	var str = "";

	for (var i = 0; i < indent; ++i) {
		str += "\t";
	}

	return str;
};

exports.Element = Element;
exports.tab = tab;