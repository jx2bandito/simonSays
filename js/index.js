//https://s3.amazonaws.com/freecodecamp/simonSound1.mp3, https://s3.amazonaws.com/freecodecamp/simonSound2.mp3, https://s3.amazonaws.com/freecodecamp/simonSound3.mp3, https://s3.amazonaws.com/freecodecamp/simonSound4.mp3

$(document).ready(function() {

  ////Cache and Initialization
  var $body = $("body");
  var $choice = $(".choice");
  var $upperleft = $("#upperleft");
  var $upperright = $("#upperright");
  var $lowerleft = $("#lowerleft");
  var $lowerright = $("#lowerright");
  var $startText = $("#startText");
  var $startLight = $("#startLight");
  var $strict = $("#strict");
  var $strictText = $("#strictText");
  var $strictLight = $("#strictLight");
  var $nightmare = $("#nightmare");
  var $nightmareText = $("#nightmareText");
  var $nightmareLight = $("#nightmareLight");
  var $message = $("#message");
  var $simon = $("#simon");
  var $power = $("#power");
  var $center = $("#center");
  var nightmareOn = false;
  var start = false;
  var powerOn = false;
  var strict = false;
  var choices = [$upperleft, $upperright, $lowerleft, $lowerright];
  var playing = false;
  var playerChoices = [];
  var traversal;
  var glow;
  var difficulty = 1;
  var tempo = 500;


    ////Audios set up
  $("audio").prop("volume", .1);
  var audio1 = document.getElementById("top-left");
  var audio2 = document.getElementById("top-right");
  var audio3 = document.getElementById("bottom-left");
  var audio4 = document.getElementById("bottom-right");
  var woosh = document.getElementById("woosh");
  var quack = document.getElementById("quack");
  /////Game Logic

  function playAudio(ID) {
    switch (ID) {
      case "upperleft":
        return audio1;
      case "upperright":
        return audio2;
      case "lowerleft":
        return audio3;
      case "lowerright":
        return audio4;
      default:
        return false;
    }
  };

  var CPUchoices = [];

  function playGame() {
    playerChoices = [];
    playing = false;
    if (!playing && start) {
      CPUchoices.push(choices[Math.floor(Math.random() * choices.length)])
      highlightCPUChoices(CPUchoices);
    }

    function highlightCPUChoices(array) {
      if (CPUchoices.length == 1) {
        difficulty = 1;
      }

      $message.html(JSON.stringify(CPUchoices.length));

      var traverse = 0;
      traversal = setInterval(function() {
        if (!start) {
          clearInterval(traversal);
          return false;
        }
        if (traverse < array.length) {
          array[traverse].css("opacity", "1");
          playAudio(array[traverse].attr("id")).currentTime = 0;
          playAudio(array[traverse].attr("id")).play();
          setTimeout(function() {
            $choice.css("opacity", "");
          }, tempo / difficulty);
          traverse++;
          if (traverse == array.length) {
            playing = true;
            clearInterval(traversal);
          }
        }
      }, tempo / difficulty * 1.5)

    }

    $choice.off().on(" mousedown", function() {
      if (!powerOn || !playing) {
        return false;
      }
      clearInterval(glow);
      $(this).css("opacity", "");
      $(this).css("opacity", 1);

      glow = setTimeout(function() {
        $choice.css("opacity", "");
      }, 200);

      if (playerChoices.length < CPUchoices.length) {
        playerChoices.push(this.id);
      };
      if (playerChoices[playerChoices.length - 1] != CPUchoices[playerChoices.length - 1].attr("id")) {
        $message.html("WRONG!");
        if (!nightmareOn) {
          $simon.css("animation", "shake .2s forwards");
          setTimeout(function() {
            $simon.css("animation", "");
          }, 200);
        }
        quack.currentTime = 0;
        quack.play();
        setTimeout(function() {
          $choice.css("opacity", "");
        }, 200);

        playerChoices = [];
        if (strict) {
          if (nightmareOn) {
            spinMe();
          }
          CPUchoices = [];
          setTimeout(function() {
            clearInterval(traversal);
            playGame();
          }, tempo);
        } else if (!strict) {
          if (nightmareOn) {
            spinMe();
          }
          setTimeout(function() {
            playing = false;
            clearInterval(traversal);
            highlightCPUChoices(CPUchoices);
          }, tempo);
        }
      }

      if (playerChoices[playerChoices.length - 1] == CPUchoices[playerChoices.length - 1].attr("id") && playerChoices.length == CPUchoices.length) {

        if (CPUchoices.length == 4) {
          difficulty = 1.33;
        }
        if (CPUchoices.length == 8) {
          difficulty = 1.66;
        }
        if (CPUchoices.length == 12) {
          difficulty = 1.99;
        }
        playing = false;
        clearInterval(traversal);
        if (playerChoices.length == 20) {
          $choice.off();
          $message.html("You win!");
          return false;
        }
        if (nightmareOn && (CPUchoices.length + 1) % 3 == 0) {
          spinMe();
        }
        setTimeout(function() {
          playGame();
        }, tempo);
      }

    })

    $upperleft.on("mousedown", function() {
      if (playerChoices.length == 0) {
        return false;
      }
      audio1.currentTime = 0;
      audio1.play();
    });

    $upperright.on("mousedown", function() {
      if (playerChoices.length == 0) {
        return false;
      }
      audio2.currentTime = 0;
      audio2.play();

    });

    $lowerleft.on("mousedown", function() {
      if (playerChoices.length == 0) {
        return false;
      }
      audio3.currentTime = 0;
      audio3.play();
    });

    $lowerright.on("mousedown", function() {
      if (playerChoices.length == 0) {
        return false;
      }
      audio4.currentTime = 0;
      audio4.play();
    });

  }

  $startText.on("mousedown", function() {
    if (!powerOn) {
      return false;
    }
    if (start) {
      playing = false;
    }
    $message.html("--");
    $(this).siblings().toggleClass("lightOn");

    start = !start;
    if (start) {
      playerChoices = [];
      CPUchoices = [];
      playGame();
    }

  })
  $strictText.on("mousedown", function() {
    if (!powerOn || start) {
      return false;
    }
    $(this).siblings().toggleClass("lightOn");
    strict = !strict;
  })
  $nightmareText.on("mousedown", function() {
    if (!powerOn || start) {
      return false;
    }
    $(this).siblings().toggleClass("lightOn");
    woosh.currentTime = 0.15;
    woosh.play();
    $body.toggleClass("nightmareBody");
    $(".choice").toggleClass("nightmareColor");
    if (!nightmareOn) {
      spinMe();

    } else {
      $simon.css("transform", "");
      $center.css("transform", "");
    }
    nightmareOn = !nightmareOn;
  })

  $power.on("click", function() {
    $("audio").attr("currentTime", 0);
    $message.html("--");
    start = false;
    playing = false;
    powerOn = !powerOn;
    nightmareOn = false;
    strict = false;
    $("#switch").toggleClass("switchOn");
    $choice.toggleClass("choiceOn");
    $body.removeClass("nightmareBody");
    $choice.removeClass("nightmareColor");
    $center.find(".selectMode").siblings().removeClass("lightOn");
    $choice.css("opacity", "");
    $simon.css("transform", "");
    $center.css("transform", "");
  })

  function spinMe() {
    var spin = Math.floor(50 + Math.random() * 100) * 90 + 45;
    $simon.css("transform", "rotateZ(" + spin + "deg)");
    $center.css("transform", "rotateZ(-" + spin + "deg)");
  }
})