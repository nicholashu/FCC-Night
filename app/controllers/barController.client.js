'use strict';

(function () {
	angular
		.module('BarController', ['clementineBarApp'])
		.controller('BarCtrl',
			['$scope',
			'$resource',
			function ($scope, $resource) {
				  var yelpUrl = appUrl + '/api/yelp/';
					var searchLocation = "Perth";

				function = getBars (){
                $http.get(yelpUrl + searchLocation).then(function(response) {
                  console.log(response);
                });
              }
            };
				}


		}]);
})();
