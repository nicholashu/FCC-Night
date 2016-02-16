'use strict';

(function() {
  angular
    .module('BarController', ['clementineBarApp'])
    .controller('BarCtrl', ['$scope',
      '$resource', '$window', '$http', 'UserService',
      function($scope, $resource, $window, $http, UserService) {
        var appUrl = $window.location.origin;
        var yelpUrl = appUrl + '/api/yelp/';
        $scope.location = '';
        $scope.isLoading = false;
        $scope.searching = false;
        $scope.getUser = function() {
                UserService.getUser().then(function(result) {
                        $scope.user = result.data;
                    });
                };

        $scope.getUser();

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
            console.log("getting bars");
            $scope.bars = bars.data;
            $scope.isLoading = false;
            $scope.searching = true;
          });
        };

        $scope.submitGoing = function(bar) {
          var user = $scope.user._id;
          $http.post('/api/reserve/' + bar + '/' + user).then(function(response) {
						console.log(response)
          });
        };



      }
    ]);
})();
