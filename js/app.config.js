(function(angular) {
  'use strict';
  angular.module('ubt.marvel')
    .config(config);


    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/characters');

      // Now set up the states
      $stateProvider.state('characters', {
          url: '/characters',
          controller: 'CharacterListController',
          templateUrl: '/js/characters.html'
        })
        .state('characters.show', {
          url: '/characters/:id',
          controller:'CharacterDetailController',
          templateUrl: '/js/character.html'
        });

    }


})(angular);
