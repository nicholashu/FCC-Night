'use strict';

(function() {
  angular
    .module('BarController', ['clementineBarApp'])
    .controller('BarCtrl', ['$scope',
      '$resource', '$window', '$http','$localStorage',
    '$sessionStorage', 'UserService',
      function($scope, $resource, $window, $http, $localStorage,
    $sessionStorage, UserService) {
        var appUrl = $window.location.origin;
        var yelpUrl = appUrl + '/api/yelp/';
        $scope.$storage = $sessionStorage;
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
          console.log(location);
          $scope.isLoading = true;
          $http.get(yelpUrl + location).then(function(bars) {
            console.log("getting bars");
            $scope.bars = bars.data;
            $scope.isLoading = false;
            $scope.searching = true;
          });
        };

        function checkReservations (){
          $http.get(yelpUrl + $scope.$storage.location).then(function(bars) {
            $scope.bars = bars.data;
          });
        }

        function previousSearch(){
          if ($scope.$storage.location){
            $scope.getBars($scope.$storage.location);
          }
        }

        previousSearch();


      $scope.barCheck = function(bar){
        console.log("checking bar");
        if($scope.user === undefined){
          return false;
        }
        if ($scope.user.shared.bars.indexOf(bar) === -1){
          return false;
        }else{
          return true;
        }
      };

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

        $scope.deleteGoing = function(bar) {
          if ($scope.user === undefined){
            window.location.href = '/auth/twitter';
          }else{
            var user = $scope.user._id;
            $http.post('/api/unreserve/' + bar + '/' + user).then(function(response) {
  						console.log(response);
              console.log("checking reservation")
              checkReservations();
            });
          }
        };


      }
    ]);
})();
