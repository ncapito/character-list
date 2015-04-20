/**
 * Character List Controller
 */
angular.module('ubt.marvel').controller('CharacterListController',
  function($scope, $location, characterService) {
    characterService.getCharacters().then(function(characters){
      $scope.characters = characters;
    });
});
