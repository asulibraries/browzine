angular.module('browzineMod', [])
  .controller('browzineController', ['$scope', '$http', function ($scope, $http) {
    var self = this;

    self.$onInit = function () {
      $scope.$ctrl = { 'parentCtrl': self.prmSearchResultAvailabilityLine };
      // window.browzine.primo.searchResult($scope);
      console.log($scope);
    }



    self.shouldEnhance() = function () {
      var validation = false;

      if (!isFiltered($scope)) {
        if (isJournal($scope) && getIssn($scope)) {
          validation = true;
        }

        if (isArticle($scope) && getDoi($scope)) {
          validation = true;
        }
      }

      return validation;
    };

    self.isFiltered() = function () {
      var validation = false;
      var result = getResult($scope);

      if (result && result.delivery) {
        if (result.delivery.deliveryCategory) {
          var deliveryCategory = result.delivery.deliveryCategory[0].trim().toLowerCase();

          if (deliveryCategory === "alma-p" && !showPrintRecords()) {
            validation = true;
          }
        }
      }

      return validation;
    };


    self.isJournal = function() {
      var validation = false;
      var result = getResult($scope);

      if (result && result.pnx) {
        if (result.pnx.display && result.pnx.display.type) {
          var contentType = result.pnx.display.type[0].trim().toLowerCase();

          if (contentType === "journal") {
            validation = true;
          }
        }
      }
      console.log(result);
      console.log("isJournal " + validation);
      return validation;
    };


    self.isArticle = function() {
      var validation = false;
      var result = getResult($scope);

      if (result && result.pnx) {
        if (result.pnx.display && result.pnx.display.type) {
          var contentType = result.pnx.display.type[0].trim().toLowerCase();

          if (contentType === "article") {
            validation = true;
          }
        }
      }
      console.log(result);
      console.log("isArticle " + validation);

      return validation;
    };

    self.getResult = function(){
      $scope.result || $scope.item;
    };

  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController',
    template: 'browzine.html'
  });
