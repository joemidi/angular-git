(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{}]},{},[1]);
