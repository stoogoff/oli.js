var Markdown = require("./markdown");
var elm = require("./element");
var _ = require("underscore");

function DocumentConverter(elements) {
	var output = [];
	var stack = [];
	var elements = elements || Markdown;
	var blockElements = {
		"Heading1": "h1",
		"Heading2": "h2",
		"Heading3": "h3",
		"Heading4": "h4",
		"Heading5": "h5",
		"Heading6": "h6",
		"Quotations": "blockquote",
	};

	this.open = function(start, end) {
		if(!start)
			return;

		if(_.isString(start))
			element = new elm.Element(start, end);
		else
			element = start;

		output.push(element.open());
		stack.push(element);
	};

	this.empty = function(element) {
		output.push(element.open());
	};

	this.close = function() {
		var element = stack.pop();

		if(element) {
			if(output[output.length - 1] && output[output.length - 1] === element.open())
				output.pop();
			else
				output.push(element.close());
		}

		return element || null;
	};

	this.closeAll = function() {
		do {
			var element = this.close();
		} while(element);
	};

	this.text = function(text) {
		if(text.trim() !== "")
			output.push(text);
	};

	this.output = function() {
		this.closeAll();

		return output.join("").replace(/\n{3,}/g, "\n\n").trim();
	};

	this.convertElements = function(tree) {
		var listIndex = 0;
		var inList = false;
		var listLevel = 0;

		tree.forEach(function(node) {
			var closeInline = 0;

			switch(node.type) {
				case "paragraph":
					var restartList = true;

					// paragraphs and headings
					if(blockElements[node.styleId]) {
						this.closeAll();
						this.open(elements[blockElements[node.styleId]]);
						inList = false;					
					}
					// handle lists
					else if(node.numbering) {
						var currentListLevel = parseInt(node.numbering.level, 10);

						// create a nested list
						if(currentListLevel > listLevel) {
							this.open(elements.list(node.numbering.isOrdered));
						}
						// open a new list
						else if(!inList) {
							this.close();
							this.open(elements.list(node.numbering.isOrdered));
						}
						// close previous li
						else
							this.close();

						// closing nested lists
						if(currentListLevel < listLevel) {
							this.close(); // close the previous list item
							this.close(); // close the list
						}

						this.open(elements.li(node.numbering.level, node.numbering.isOrdered ? ++listIndex : null));

						inList = true;
						restartList = false;
						listLevel = currentListLevel;
					}
					// treat everything else as a paragraph
					else {
						this.closeAll();
						this.open(elements.p);
						inList = false;
					}

					if(restartList) {
						listIndex = 0;

						if(inList)
							this.close();

						inList = false;
					}

					break;

				case "tab":
					this.text("\t");
					break;

				case "lineBreak":
					this.empty(elements.br);
					break;

				case "image":
					this.empty(elements.img(node));

					break;

				case "hyperlink":
					this.open(elements.a(node.href));
					++closeInline;

					break;

				case "run":
					if(node.isItalic) {
						this.open(elements.italic);
						++closeInline;
					}
					if(node.isBold) {
						this.open(elements.bold);
						++closeInline;
					}

					break;

				case "text":
					this.text(node.value);
					break;

				// TODO - don't think document needs anything but the others might
				// document
				// noteReference
				// note
				// table
				// tableRow
				// tableCell
			}

			if(node.children)
				this.convertElements(node.children);

			while(closeInline-- > 0)
				this.close();

		}.bind(this));
	};
}

exports.DocumentConverter = DocumentConverter;