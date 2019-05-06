angular.module('browzineMod', [])
  .controller('browzineController', ['$scope', function ($scope) {
    console.log("we are in the browzine module")
    var self = this;
    console.log(this);
    console.log(self.prmSearchResultAvailabilityLine)
    $scope.ctrl = {'parentCtrl': self.prmSearchResultAvailabilityLine};
    window.browzine.primo.searchResult($scope);
  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController'
  });
