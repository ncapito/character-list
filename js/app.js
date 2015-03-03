/**
 * Top Level Application Config + Routes
 */
angular.module('CharacterList', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when("/characters", {
            // define controllers and templates here to keep markup cleaner
            templateUrl: "partials/characters.html",
            controller: "CharacterListController"
        }).
        when("/characters/:id", {
            templateUrl: "partials/character.html",
            controller: "CharacterDetailController"

        }).
        otherwise({redirectTo: '/characters'});
}]);
