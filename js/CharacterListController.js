/**
 * Character List Controller
 */
angular.module('CharacterList').controller('CharacterListController',
  function($scope, $location, characterService) {
    characterService.getCharacters().then(function(characters){
      $scope.characters = characters;
    });
});
