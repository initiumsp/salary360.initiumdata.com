var ScorePage = React.createClass({

  shareToWeibo: function () {
    var title = encodeURIComponent(nkoreaTest.text.scoreDescription + nkoreaTest.totalScore.toString() + nkoreaTest.text.shareHint),
        url = encodeURIComponent(nkoreaTest.url);
    window.open('http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+nkoreaTest.url);
  },

  shareToFacebook () {
    var description = encodeURIComponent(nkoreaTest.text.scoreDescription + nkoreaTest.totalScore.toString() + nkoreaTest.text.shareHint),
        url = encodeURIComponent(nkoreaTest.url);
    window.open('https://www.facebook.com/dialog/feed?app_id=743206445788490+' +
                '&link=' + url +
                '&picture=' + nkoreaTest.url + nkoreaTest.shareImgRelativePath +
                '&name=' + nkoreaTest.title +
                '&description=' + description +
                '&redirect_uri=' + url
    );
  },

  });