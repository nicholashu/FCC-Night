'use strict';

(function() {
  angular
    .module('BarController', ['clementineBarApp'])
    .controller('BarCtrl', ['$scope',
      '$resource', '$window', '$http',
      function($scope, $resource, $window, $http) {
        var appUrl = $window.location.origin;
        var yelpUrl = appUrl + '/api/yelp/';
        $scope.location = '';
        $scope.isLoading = false;
        $scope.searching = false;



        $scope.activeSearch = function() {
          if ($scope.searching === true) {
            return true;
          } else {
            return false;
          }
        };

        $scope.loading = function() {
          if ($scope.isLoading === true) {
            return true;
          } else {
            return false;
          }
        };

        $scope.getBars = function(location) {
          $scope.isLoading = true;
          $http.get(yelpUrl + location).then(function(bars) {
            $scope.bars = bars.data.businesses;
						console.log($scope.bars);
            $scope.isLoading = false;
            $scope.searching = true;
          });
        };

        $scope.submitGoing = function(bar) {
          var user = $scope.user;
          console.log(user)
          $http.post('/api/reserve/' + bar + '/' + user).success(function(response) {
						console.log(response)
          });
        };



      }
    ]);
})();
