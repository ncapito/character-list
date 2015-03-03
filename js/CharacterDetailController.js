/**
 * Character Detail Controller
 */
angular.module('CharacterList')
  .controller('CharacterDetailController', function($scope, characterService) {
    window.scrollTo(0,0); // scroll top for small screens
    characterService.getCharacter(100).then(function(character){
      $scope.character = character;
    });
});
