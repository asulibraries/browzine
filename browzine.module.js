angular.module('browzineMod', [])
  .controller('browzineController', ['$scope', '$http', function ($scope, $http) {
    var self = this;

    self.$onInit = function () {
      $scope.$ctrl = { 'parentCtrl': self.prmSearchResultAvailabilityLine };
      // window.browzine.primo.searchResult($scope);
      console.log(self.prmSearchResultAvailabilityLine);
      console.log(self.getResult());
    }



    // self.shouldEnhance() = function () {
    //   var validation = false;

    //   if (!isFiltered($scope)) {
    //     if (isJournal($scope) && getIssn($scope)) {
    //       validation = true;
    //     }

    //     if (isArticle($scope) && getDoi($scope)) {
    //       validation = true;
    //     }
    //   }

    //   return validation;
    // };

    // self.isFiltered() = function () {
    //   var validation = false;
    //   var result = getResult();

    //   if (result && result.delivery) {
    //     if (result.delivery.deliveryCategory) {
    //       var deliveryCategory = result.delivery.deliveryCategory[0].trim().toLowerCase();

    //       if (deliveryCategory === "alma-p" && !showPrintRecords()) {
    //         validation = true;
    //       }
    //     }
    //   }

    //   return validation;
    // };


    // self.isJournal = function() {
    //   var validation = false;
    //   var result = getResult();

    //   if (result && result.pnx) {
    //     if (result.pnx.display && result.pnx.display.type) {
    //       var contentType = result.pnx.display.type[0].trim().toLowerCase();

    //       if (contentType === "journal") {
    //         validation = true;
    //       }
    //     }
    //   }
    //   console.log(result);
    //   console.log("isJournal " + validation);
    //   return validation;
    // };


    // self.isArticle = function() {
    //   var validation = false;
    //   var result = getResult();

    //   if (result && result.pnx) {
    //     if (result.pnx.display && result.pnx.display.type) {
    //       var contentType = result.pnx.display.type[0].trim().toLowerCase();

    //       if (contentType === "article") {
    //         validation = true;
    //       }
    //     }
    //   }
    //   console.log(result);
    //   console.log("isArticle " + validation);

    //   return validation;
    // };

    self.getResult = function(){
      self.prmSearchResultAvailabilityLine.result || self.prmSearchResultAvailabilityLine.item;
    };

  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController',
    template: "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>\
    <a class='browzine-direct-to-pdf-link' href='{{directToPDFUrl}}' target='_blank'>\
          <img src='{{pdfIcon}}' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 2.8px;' aria-hidden='true' width='12' height='16'/>\
          <span class='browzine-web-link-text'>{{articlePDFDownloadLinkText}}</span>\
          <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' style='color: #757575;' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
      </a>\
  </div>\
  <div class='browzine' style='line-height: 1.4em;'>\
      <a class='browzine-web-link' href='{{browzineWebLink}}' target='_blank'>\
          <img src='{{bookIcon}}' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/>\
          <span class='browzine-web-link-text'>{{browzineWebLinkText}}</span>\
          <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' style='color: #757575;' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
      </a>\
  </div>\
  "
  });
