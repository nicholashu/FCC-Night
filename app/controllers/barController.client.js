'use strict';

(function() {
    angular
      .module('BarController', ['clementineBarApp'])
      .controller('BarCtrl', ['$scope',
        '$resource', '$window', '$http',
        function($scope, $resource, $window, $http) {
					var appUrl = $window.location.origin;
          var yelpUrl = appUrl + '/api/yelp/';
          var searchLocation = "Perth";

          function getBars() {
            $http.get(yelpUrl + searchLocation).then(function(response) {
              console.log(response.data.businesses);
            });
          }
          getBars();



      }]);
})();
