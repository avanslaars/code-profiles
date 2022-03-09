var gifffer = function (selector, onPlay, onPause) {
  var images, d = document, ga = 'getAttribute', sa = 'setAttribute';
  images = d && d.querySelectorAll ? d.querySelectorAll(selector || 'img:not(.giffferated)[data-gifffer]') : [];
  var createContainer = function (w, h, el) {
      var con = d.createElement('DIV'), cls = el[ga]('class'), id = el[ga]('id');
      cls ? con[sa]('class', el[ga]('class')) : null;
      id ? con[sa]('id', el[ga]('id')) : null;
      var conStyle = 'position:relative;max-width:' + w + 'px;max-height: ' + h + 'px;';
      if (el && el.style && el.style.display) {
        conStyle += 'display:' + (el && el.style && el.style.display) + ';'
      }
      con[sa]('style', conStyle);
      // creating play and pause buttons
      var play = d.createElement('DIV');
      play[sa]('class', 'gifffer-play-button');
      var trngl = d.createElement('DIV');
      trngl[sa]('class', 'gifffer-play-button-triangle');
      play.appendChild(trngl);

      var pause = d.createElement('DIV');
      pause[sa]('class', 'gifffer-pause-button');
      var bar1 = d.createElement('DIV');
      var bar2 = d.createElement('DIV');
      bar1[sa]('class', 'gifffer-pause-button-bar1');
      bar2[sa]('class', 'gifffer-pause-button-bar2');
      pause.appendChild(bar1);
      pause.appendChild(bar2);

      // dom placement
      con.appendChild(play);
      el.parentNode.replaceChild(con, el);
      return {c: con, p: play, ps: pause};
    },
    i = 0,
    imglen = images.length,
    process = function (el) {
      var url, con, c, w, h, duration, play, pause, gif, playing = false, cc, isC, durationTimeout;
      url = el[ga]('data-gifffer');
      w = el[ga]('data-gifffer-width');
      h = el[ga]('data-gifffer-height');
      duration = el[ga]('data-gifffer-duration');
      el.style.display = 'block';
      c = document.createElement('canvas');
      isC = !!(c.getContext && c.getContext('2d'));
      if (w && h && isC) cc = createContainer(w, h, el);
      el.onload = function () {
        if (isC) {
          w = w || el.naturalWidth || el.width;
          h = h || el.naturalHeight || el.height;
          // creating the container
          if (!cc) cc = createContainer(w, h, el);
          con = cc.c;
          play = cc.p;
          pause = cc.ps;

          gif = d.createElement('IMG');
          gif[sa]('class', 'giffferated');
          gif[sa]('style', 'width:' + w + 'px;max-width: 100%;');
          gif[sa]('data-uri', Math.floor(Math.random() * 100000) + 1);

          pause.addEventListener('click', function (event) {
            event.preventDefault();
            clearTimeout(durationTimeout);
            if (playing) {
              playing = false;
              con.appendChild(play);
              con.removeChild(pause);
              con.appendChild(c);
              con.removeChild(gif);
              onPause && onPause();
            }
          });
          play.addEventListener('click', function (event) {
            event.preventDefault();
            clearTimeout(durationTimeout);
            if (!playing) {
              setTimeout(function () {
                gif.src = url;
              }, 0);
              playing = true;
              gif.src = url;
              con.appendChild(pause);
              con.removeChild(play);
              con.removeChild(c);
              con.appendChild(gif);
              if (parseInt(duration) > 0) {
                durationTimeout = setTimeout(function () {
                  playing = false;
                  con.appendChild(play);
                  con.removeChild(gif);
                  con.appendChild(c);
                  gif = null;
                }, duration);
              }
              onPlay && onPlay();
            }
          });
          // canvas
          c.width = w;
          c.height = h;
          c[sa]('style', 'max-width: 100%;');
          c.getContext('2d').drawImage(el, 0, 0, w, h);
          con.appendChild(c);
        }
      }
      el.src = url;
    }
  for (i; i < imglen; ++i) process(images[i]);
}
