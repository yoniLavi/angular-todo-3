angular.module('RouteControllers', [])
	.controller('HomeController', function($scope) {
		$scope.title = "Welcome To Angular Todo!";
	})
	.controller('RegisterController', function($scope, UserAPIService, store) {

		$scope.registrationUser = {};
		var url = "http://127.0.0.1:8000/";

		$scope.submitForm = function() {
			if ($scope.registrationForm.$valid) {
				$scope.registrationUser.username = $scope.user.username;
				$scope.registrationUser.password = $scope.user.password;

				UserAPIService.callAPI(url + "accounts/register/", $scope.registrationUser).then(function(results) {
					$scope.data = results.data;
					if ($scope.data.username == $scope.registrationUser.username && $scope.data.password == $scope.registrationUser.password) {
						alert("You have successfully registered to Angular Todo");

						UserAPIService.callAPI(url + "accounts/api-token-auth/", $scope.data).then(function(results) {
							$scope.token = results.data.token;
							store.set('username', $scope.registrationUser.username);
							store.set('authToken', $scope.token);
						}).catch(function(err) {
							console.log(err);
						});
					}
				}).catch(function(err) {
					console.log(err)
				});
			}
		}
	})
	.controller('TodoController', function($scope, $location, TodoAPIService, store) {
		var url = "http://127.0.0.1:8000/";

		$scope.authToken = store.get('authToken');
		$scope.username = store.get('username');

		$scope.todo = {};

		if (!store.get('authToken')) {
			$location.path("/");
		}

		TodoAPIService.getTodos(url + "todo/", $scope.username, $scope.authToken).then(function(results) {
			$scope.todos = results.data;
		}).catch(function(err) {
			console.log(err);
		});

		$scope.submitForm = function() {
			if ($scope.todoForm.$valid) {
				$scope.todo.title = $scope.todo.title;
				$scope.todo.description = $scope.todo.description;
				$scope.todo.status = $scope.todo.status;
				$scope.todo.username = $scope.username;

				console.log($scope.todo.username)

				TodoAPIService.createTodo(url + "todo/", $scope.todo, $scope.authToken).then(function(results) {
					console.log(results)
				}).catch(function(err) {
					console.log(err)
				})
			}
		}
	});