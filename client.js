var Client = (function() {
  var self = this;

  var clear = function() {
    var div  = $('#first div');
    div.text("");
  };
  var print = function(message){
    var div  = $('#first div');
    var br = $("<br>");
    var code = $("<code>");

    code.text(message);
    div.append(code);
    div.append(br);
    div.scrollTop(div.scrollTop()+10000);
    console.log(message);
  };

  var firstMsg = true;

  return {
    nick: 'me',
    onOpen: function() {
      print(" [*] connection ready.");
    }, 
    onMessage: function(msg) {

      print(msg.data);
    },
    onClose: function() {
      print(" [*] connection closed.");
    },
    print: print,
    clear: clear,
  };
})();
