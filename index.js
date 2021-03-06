var events = require('component-events');
var emitter = require('component-emitter');

module.exports = ColorPicker;


var colors = [
  // colors from http://developer.android.com/design/style/color.html
  '#33b5e5',
  '#aa66cc',
  '#99cc00',
  '#ffbb44',
  '#ff4444',

  '#0099cc',
  '#9933cc',
  '#669900',
  '#ff8800',
  '#cc0000',

  // colors from http://purecss.io/
  '#0e90d2',
  '#8058a5',
  '#5eb95e',
  '#dd514c',
  '#f37b1d',
  '#fad232'
];

function ColorPicker(choices, color) {
  var picker = createPicker(choices, color);

  this.element = picker.picker;
  this.editor = picker.editor;

  this.events = events(this.element, this);
  this.events.bind('click .color-chooser-color', 'choose');
  this.events.bind('keyup .color-picker-editor', 'change');
}
emitter(ColorPicker.prototype);


/**
 * Choose a color.
 */
ColorPicker.prototype.choose = function(e) {
  var color = e;
  if (e && e.preventDefault) {
    e.preventDefault();
    color = e.target.getAttribute('href');
  }
  this.value(color);
};


/**
 * Change the color value.
 */
ColorPicker.prototype.change = function(e) {
  var color = e;
  if (e && e.target) {
    color = e.target.value;
  }
  this.value(color);
};


/**
 * Get or set the color value.
 */
ColorPicker.prototype.value = function(color) {
  if (!color) {
    return this.editor.value;
  }
  if (validColor(color)) {
    this.editor.value = color;
    this.editor.style.borderColor = color;
    this.emit('change', color);
  }
};

/**
 * Take over the position of the `input` dom.
 */
ColorPicker.prototype.takeover = function(input) {
  if (input.value && validColor(input.value)) {
    // reset default color
    this.change(input.value);
  }

  // render element to the dom
  input.parentNode.insertBefore(this.element, input);

  // hide original input
  input.style.display = 'none';

  // bind event
  this.on('change', function(color) {
    input.value = color;
  });
};


/**
 * Create picker with the given `options`.
 */
function createPicker(choices, color) {
  choices = choices || colors;

  if (!Array.isArray(choices) && !color) {
    // when `createPicker('#000000')
    color = choices;
    choices = colors;
  }

  var chooser = createChooser(choices);
  var editor = createEditor(color);

  var picker = document.createElement('div');
  picker.className = 'color-picker';
  picker.appendChild(chooser);
  picker.appendChild(editor);
  return {
    picker: picker,
    chooser: chooser,
    editor: editor
  };
}


/**
 * Create the color chooser with the given `colors`.
 */
function createChooser(colors) {
  var fields = colors.map(function(color) {
    return '<a class="color-chooser-color" href="' + color + '" style="background-color: ' + color + '!important"></a>';
  });
  var chooser = document.createElement('div');
  chooser.className = 'color-picker-chooser';
  chooser.innerHTML = fields.join('');
  return chooser;
}


/**
 * Create editor input with the given `color`.
 */
function createEditor(color) {
  color = color || '#333333';
  var input = document.createElement('input');
  input.value = color;
  input.className = 'color-picker-editor';
  input.style.borderColor = color;
  input.setAttribute('maxlength', 7);
  return input;
}


/**
 * Check if the color is valid.
 */
function validColor(color) {
  return color.match(/^#[0-9a-fA-F]{6}$/) || color.match(/^#[0-9a-fA-F]{3}$/);
}
