angular.module('browzineMod', [])
  .controller('browzineController', [function ($scope) {
    console.log("we are in the browzine module")
    var self = this;
    console.log(self.prmSearchResultAvailabilityLine)
    $scope.ctrl = self.prmSearchResultAvailabilityLine;
    window.browzine.primo.searchResult($scope);
  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController'
  });
