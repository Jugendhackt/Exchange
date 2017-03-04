
	firebase.initializeApp(_jh_config.firebase)


	function writeUserData(userId, name, email, imageUrl) {
		firebase.database().ref('users/' + userId).set({
			username: name,
			email: email,
			profile_picture : imageUrl
		})


	}



var app = angular.module('Test', [


app.controller("AppCtrl", [
	'$scope',
	'$firebaseArray',
	'$mdDialog',

	function($scope, $firebaseArray, $mdDialog) {
		 var ref = firebase.database().ref().child("messages");
		// create a synchronized array
		// click on `index.html` above to see it used in the DOM!
		$scope.messages = $firebaseArray(ref);

		$scope.post = function(){
			$scope.messages.$add({content: $scope.content, from: $scope.from, timestamp: firebase.database.ServerValue.TIMESTAMP})
			$scope.content = ''
		}


		$scope.register = function(ev){
			$mdDialog.show({
				contentElement: '#registerDialog',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: true
			});
		}

	}
]);
