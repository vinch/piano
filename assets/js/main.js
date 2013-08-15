// Defining namespace

var br = br || {};

// App containing events + controllers

br.App = function() {

  var that = this;

  that.el = {
    doc: $(document)
  };

  that.initialize = function() {
    that.piano = new br.Piano();
    that.console = new br.Console();
    that.player = new br.Player();

    that.el.doc.keypress(that.docKeyPressed);
    that.piano.el.key.click(that.keyClicked);
    that.console.el.clear.click(that.clearClicked);
    that.player.el.input.keypress(that.inputKeyPressed);
    that.player.el.button.click(that.playClicked);
  };

  that.docKeyPressed = function(e) {
    var kc = e.which
      , key = String.fromCharCode(kc);

    that.pressKey(key);
  };

  that.keyClicked = function(e) {
    var $target = $(e.target)
      , key = $target.data('key');

    that.pressKey(key);
  };

  that.clearClicked = function(e) {
    e.preventDefault();
    that.console.clear();
  };

  that.inputKeyPressed = function(e) {
    e.stopPropagation();
  };

  that.playClicked = function(e) {
    var value = that.player.el.input.val()
      , symphony = value.toLowerCase().split(',')
      , currentIndex = 0;
    
    if (value === "") return;

    that.player.disable();
    that.pressKey(symphony[currentIndex]);

    var interval = setInterval(function() {
      currentIndex++;
      if (currentIndex === symphony.length) {
        clearInterval(interval);
        that.player.enable();
        return;
      }
      that.pressKey(symphony[currentIndex]);
    }, 1000);

  };

  that.pressKey = function(key) {
    if (that.piano.el.content.find('.white_key[data-key="' + key + '"]').length > 0) {
      that.piano.pressKey(key);
      that.piano.sounds[key].play();
      that.console.add(key);
    }
    else {
      that.piano.sounds['_'].play(); // playing error sound if we can't find an existing key
    }
  };

  that.initialize();

  return that;
}

// Piano actions

br.Piano = function() {

  var that = this;

  that.el = {
      content: $('#piano')
    , key: $('.white_key')
  };

  that.sounds = {
      'a': new Audio('assets/wav/accordion.wav')
    , 'b': new Audio('assets/wav/bell.wav')
    , 'c': new Audio('assets/wav/clap.wav')
    , 'd': new Audio('assets/wav/duck.wav')
    , 'e': new Audio('assets/wav/elephant.wav')
    , 'f': new Audio('assets/wav/fart.wav')
    , 'g': new Audio('assets/wav/goat.wav')
    , '_': new Audio('assets/wav/_.wav') // error sound
  };

  that.pressKey = function(key) {
    var $key = that.el.content.find('.white_key[data-key="' + key + '"]');
    $key.addClass('active');
      setTimeout(function() {
        $key.removeClass('active');
      }, 100);
  };

  return that;

}

// Console actions

br.Console = function() {

  var that = this;

  that.el = {
      content: $('#console .content')
    , clear: $('#console a')
  };

  that.add = function(value) {
    that.el.content.append(value);
  };

  that.clear = function() {
    that.el.content.html('');
  }

  return that;

}

// Player actions

br.Player = function() {

  var that = this;

  that.el = {
    input: $('#player input'),
    button: $('#player button')
  };

  that.enable = function() {
    that.el.input.removeAttr('disabled');
    that.el.button.removeAttr('disabled');
  };

  that.disable = function() {
    that.el.input.attr('disabled', 'disabled');
    that.el.button.attr('disabled', 'disabled');
  };

  return that;

}

// Initialization of the application

$(function() {
  var app = new br.App();
});
