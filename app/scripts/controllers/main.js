'use strict';

/**
 * @ngdoc function
 * @name salary360initiumdatacomApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the salary360initiumdatacomApp
 */
angular.module('salary360initiumdatacomApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.input = {
      region: 'hk',
      district: 'a',
      area: 'a01',
      gender: 'both',
      salary: 11555
    };

    $scope.options = {
      region: ['hk', 'kl', 'nt'],
      district: ['a', 'b', 'c'],
      area: ['a01', 'b02', 'c03'],
      gender: ['male', 'female', 'both']
    };

    // TODO: can migrate to i18n

    var apiPrefix = 'api';

    $http.get(apiPrefix + '/census2011/geo/translation-areas.json')
      .success(function(d){
        $scope.translationAreas = d;
      });

    $http.get(apiPrefix + '/census2011/geo/translation-districts.json')
      .success(function(d){
        $scope.translationDistricts = d;
      });

    $http.get(apiPrefix + '/census2011/geo/translation-regions.json')
      .success(function(d){
        $scope.translationRegions = d;
      });

    $scope.translationGenders = {
      male: {T: '男性'},
      female: {T: '女性'},
      both: {T: '所有人'}
    };

    $http.get(apiPrefix + '/census2011/geo/geo-tree.json')
      .success(function(d){
        $scope.geoTree = d;
        $scope.getDistrictByRegion();
      });

    // Tracking code begin

    xdomain.slaves({
      "https://ss.initiumlab.com": "/proxy.html"
    });

    $scope.setUUID = function() {

      // If localStorage contains an existing UUID, use it as the UUID of the app.
      // Otherwise, get a UUID from server.

      "use strict";
      try {
          if (localStorage.getItem('uuid')) {
            this.uuid = localStorage.getItem('uuid');
          } else {
            var url = 'https://ss.initiumlab.com/utility/uuid/';
            var uuid = 'DEFAULT'+Math.random().toString(); // In case UUID server fails
            this.uuid = uuid;
            localStorage.setItem('uuid', uuid);
            var request = new XMLHttpRequest();

            request.open('GET', url, true);
            var self = this;
            request.onload = function () {
              console.log('UUID server responded');
              if (request.status >= 200 && request.status < 400) {
                var response = JSON.parse(request.responseText);
                if (response.success) {
                  uuid = response.data.uuid;
                }
              }
              self.uuid = uuid;
              localStorage.setItem('uuid', uuid);
            };
            request.send();
          }
        }
      catch (error) {
        this.uuid = 'DEFAULT'+Math.random().toString();
        console.log('UUID error');
        $scope.post('UUID setting error', '');
      }
    };

    $scope.post = function(keyToPost, valueToPost) {
      "use strict";
      var url = "https://ss.initiumlab.com/remember/salary360/";
      var request = new XMLHttpRequest();
      var message = {
        username: $scope.uuid,
        key: keyToPost,
        value: valueToPost,
        raw: '',
        datetime: Date.now()
      };

      request.open('POST', url, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      var jsonString = JSON.stringify(message);
      request.send(jsonString);
      console.log('Tried to post '+jsonString);
    };

    $scope.setUUID();
    $scope.post('render', window.location.href);

    $scope.handleWeiboShare = function(){
      var title = encodeURIComponent('月入一萬,放在香港是個啥水平?快戳這裡算一算你在香港還是不是個壕!【 Initium Lab 出品,玩轉大數據】'),
        url = encodeURIComponent('salary360.initiumlab.com');
      var target_url = 'http://v.t.sina.com.cn/share/share.php?title='+title+'&url='+url;
      window.open(target_url);
      $scope.post('share', 'weibo');
    };

    $scope.handleFacebookShare = function(){
      var description = encodeURIComponent('月入一萬,放在香港是個啥水平?快戳這裡算一算你在香港還是不是個壕!【 Initium Lab 出品,玩轉大數據】'),
        url = encodeURI('salary360.initiumlab.com'),
        title = encodeURIComponent('18區人工大比拼'),
        imageURL = encodeURIComponent(url + './images/cover-share.png');
      //var target_href = 'https://www.facebook.com/dialog/feed?app_id=1180811835286005' +
      //  '&link=' + url +
      //  '&picture=' + imageURL +
      //  '&name=' + title +
      //  '&description=' + description +
      //  '&redirect_uri=' + url;
      var target_href = "https://www.facebook.com/sharer/sharer.php?s=100&u=http%3A%2F%2Fsalary360.initiumlab.com";
      window.open(target_href);
      $scope.post('share', 'facebook')
    };

/*
    var dataForWeixin = {  
        appId: "",
        imgUrl: './images/cover-share.png',  
        lineLink: 'salary360.initiumlab.com',  
        shareTitle: '18區人工大比拼',  
        descContent: '月入一萬,放在香港是個啥水平?快戳這裡算一算你在香港還是不是個壕!【 Initium Lab 出品,玩轉大數據】',  
    };  

   function onBridgeReady() {
      WeixinJSBridge.invoke('shareTimeline',{
        "appid": dataForWeixin.appId, 
        "img_url": dataForWeixin.imgUrl,
        "img_width": "640",
        "img_height": "640",
        "link": dataForWeixin.lineLink,
        "desc": dataForWeixin.descContent,
        "title": dataForWeixin.shareTitle
      }, function(res) {
        _report('timeline', res.err_msg);
      });
    }
*/


    // Tracking code ends

    // Sharing code begins
    var setWeiboShare = (function () {
      var title = encodeURIComponent('月入一萬,放在香港是個啥水平?快戳這裡算一算你在香港還是不是個壕!【 INITIUMLAB 出品,玩轉大數據】'),
          url = encodeURIComponent('salary360.initiumlab.com');
    }());

    var setFacebookShare = (function () {
      var description = encodeURIComponent('月入一萬,放在香港是個啥水平?快戳這裡算一算你在香港還是不是個壕!【 INITIUMLAB 出品,玩轉大數據】'),
        url = encodeURIComponent('salary360.initiumlab.com'),
        title = encodeURIComponent('18區人工大比拼'),
        imageURL = encodeURIComponent(url + './images/cover-share.png');
    }());

//share for wechat


/*
    $scope.wechatPopupOpened = false;
    $scope.shareToWechat = function() {

      if ($scope.wechatPopupOpened) {
        return;
      } else {
        $scope.wechatPopupOpened = true;
      }

      var divWechatShare = document.createElement('div');
      var textNode = document.createTextNode('請使用瀏覽器內置的分享功能');
      divWechatShare.appendChild(textNode);

      divWechatShare.style.backgroundColor = '#333';
      divWechatShare.id = 'divWechatShare';

      divWechatShare.style.position = 'absolute';
      divWechatShare.style.left = $('#btnWechatShare').offset().left + $('#btnWechatShare').width() / 3 + 'px';
      divWechatShare.style.top = $('#btnWechatShare').offset().top - $('#btnWechatShare').height() + 'px';

      divWechatShare.addEventListener('mousedown', function(event){
        event.target.style.display = 'none';
        $scope.wechatPopupOpened = false;
      });

      document.body.appendChild(divWechatShare);
      $scope.post('share', 'wechat')
    };
  */
    // Sharing code ends


    $scope.getDistrictByRegion = function(){
      $scope.options.district = _.map($scope.geoTree[$scope.input.region], function(value, key){return key;});
      // Set default
      $scope.input.district = $scope.options.district[0];

      // Send data to backend
      $scope.post('region_selection', $scope.input.region);

      $scope.getAreaByDistrict();
    };

    $scope.getAreaByDistrict = function(){
      $scope.options.area = $scope.geoTree[$scope.input.region][$scope.input.district];
      // Set default
      $scope.input.area = $scope.options.area[0];
      $scope.post('district_selection', $scope.input.district);
    };

    $scope.trackAreaChange = function(){
      $scope.post('area_selection', $scope.input.area);
    };

    $scope.trackGenderChange = function(){
      $scope.post('gender_selection', $scope.input.gender);
    };

    $scope.trackSalaryChange = function(){
      $scope.post('salary_selection', $scope.input.salary);
    };

    $('input[type="range"]').val(10).change();

  }]);
