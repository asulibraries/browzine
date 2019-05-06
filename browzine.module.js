// angular.module('browzineMod', [])
//   .controller('browzineController', ['$scope', function ($scope) {
//     console.log("we are in the browzine module")
//     var self = this;
//     console.log(this);
//     console.log(self.prmSearchResultAvailabilityLine)
//     $scope.ctrl = {'parentCtrl': self.prmSearchResultAvailabilityLine};
//     window.browzine.primo.searchResult($scope);
//   }])
//   .component('browzineMod', {
//     require: {
//       prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
//     },
//     controller: 'browzineController'
//   });


angular.module('browzineMod', [])
  .controller('browzineController', [function () {
    var self = this;
    console.log(self.prmSearchResultAvailabilityLine);

    self.$onInit = function () {
      console.log("in init")
      $scope.ctrl = { 'parentCtrl': self.prmSearchResultAvailabilityLine };
      // window.browzine.primo.searchResult($scope);
    }

  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    bindings: {
      hideOnline: '<',
      msg: '@?'
    },
    controller: 'browzineController',
  });
