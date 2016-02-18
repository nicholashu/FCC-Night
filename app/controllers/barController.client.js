'use strict';

(function() {
  angular
    .module('BarController', ['clementineBarApp'])
    .service('LocationStorage', ['$http', '$location', function($http, $location) {
            var location = "";
        }])
    .controller('BarCtrl', ['$scope',
      '$resource', '$window', '$http', 'LocationStorage', 'UserService',
      function($scope, $resource, $window, $http, LocationStorage, UserService) {
        var appUrl = $window.location.origin;
        var yelpUrl = appUrl + '/api/yelp/';
        $scope.LocationStorage = LocationStorage;
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
          LocationStorage.location = location;
          $scope.isLoading = true;
          $http.get(yelpUrl + location).then(function(bars) {
            console.log("getting bars");
            $scope.bars = bars.data;
            $scope.isLoading = false;
            $scope.searching = true;
          });
        };

        function checkReservations (){
          $http.get(yelpUrl + $scope.location).then(function(bars) {
            $scope.bars = bars.data;
          });
        }


        $scope.submitGoing = function(bar) {
          if ($scope.user === undefined){
            window.location.href = '/auth/twitter';
          }else{
            var user = $scope.user._id;
            $http.post('/api/reserve/' + bar + '/' + user).then(function(response) {
  						console.log(response);
              console.log("checking reservation")
              checkReservations();
            });
          }

        };

      }
    ]);
})();
