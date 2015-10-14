var app = angular.module('AngularGit',[]);

app.controller('InfoController', ['$scope','$http', function($scope, $http){
	console.log("anggggggggggg");

	$scope.getInfoFromGithub = function(username) {
		console.log("Get Info for " + username);
		if (typeof username === "string" && username != ""){
			$scope.error = undefined;

			// $http.get().then(function(data){
			// 	$scope.data = data;
			// });
			
			// Simple GET request example:
			$http({
			  method: 'GET',
			  url: 'https://api.github.com/users/'+username
			}).then(function successCallback(response) {
			    // success
			    $scope.data = response.data;
			    $scope.error = undefined;
			    if($scope.data.status == 200){

			    }
			  }, function errorCallback(response) {
			    // error!
			    $scope.error = "Network Error " +response.status+ " " +response.statusText;
			    $scope.data = undefined;
			  });

		} else {
			$scope.error = "You need to enter a valid Github user name!";
		}
	}
}]);