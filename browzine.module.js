import "./browzine-primo-adapter";

angular.module('browzineMod', [])
  .controller('browzineController', ['$scope', function ($scope) {
    var self = this;

    self.$onInit = function () {
      $scope.$ctrl = { 'parentCtrl': self.prmSearchResultAvailabilityLine };
      window.browzine.primo = browzine;
      window.browzine.primo.searchResult($scope);
    }

  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController',
  });
