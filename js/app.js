
<<<<<<< HEAD
	firebase.initializeApp(_jh_config.firebase)


	function writeUserData(userId, name, email, imageUrl) {
		firebase.database().ref('users/' + userId).set({
			username: name,
			email: email,
			profile_picture : imageUrl
		})

=======
  firebase.initializeApp(_jh_config.firebase)

  function writeUserData(userId, name, email, imageUrl) {
	  firebase.database().ref('users/' + userId).set({
	    username: name,
	    email: email,
	    profile_picture : imageUrl
	  })
>>>>>>> cdbd296c315f33ee2cea9aa053ba9250da4939a0
	}



<<<<<<< HEAD
var app = angular.module('jhvw', [
=======
var app = angular.module('Test', [
>>>>>>> cdbd296c315f33ee2cea9aa053ba9250da4939a0
	'ngMaterial',
	'firebase'
])


<<<<<<< HEAD
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
=======
app.controller("SampleCtrl", function($scope, $firebaseArray) {
   var ref = firebase.database().ref().child("messages");
  // create a synchronized array
  // click on `index.html` above to see it used in the DOM!
  $scope.messages = $firebaseArray(ref);

  $scope.post = function(){
  	$scope.messages.$add({message: $scope.message, from: $scope.username})
  	$scope.message = ''
  }

});
>>>>>>> cdbd296c315f33ee2cea9aa053ba9250da4939a0
