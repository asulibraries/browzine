angular.module('browzineMod', [])
  .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push('https://public-api.thirdiron.com/public/v1/' + '**');
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  }])
  .controller('browzineController', ['$scope', '$http', function ($scope, $http) {
    var self = this;

    self.$onInit = function () {
      // $scope.$ctrl = { 'parentCtrl': self.prmSearchResultAvailabilityLine };
      // connect these to the config later;
      console.log(self);
      self.browzineEnabled = true; //connect to config later
      self.journalCoverImagesEnabled = true; //connect to cnofig later
      self.journalBrowZineWebLinkTextEnabled = true;
      self.journalBrowZineWebLinkText = "View journal contents (Browzine coverage)";self.acticleBrowZineWebLinkTextEnabled = true;
      self.articleBrowZineWebLinkText = "View issue contents";
      self.articlePDFDownloadLinkEnabled = true;
      self.articlePDFDownloadLinkText = "View PDF";
      self.printRecordsIntegrationEnabled = true;
      self.browzineWebLinkText = "";
      self.data = {};
      self.pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
      self.bookIcon = "https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg";
      self.apiKey = "a1d2656d-d27c-466f-b549-f14a645a2024";
      self.api = "https://public-api.thirdiron.com/public/v1/libraries/158";
      console.log("initializing browzine");
      // console.log(self.prmSearchResultAvailabilityLine);
      // console.log(self.browzineEnabled);
      self.result = self.getResult();
      self.browzineWebLink = null;

      if(self.browzineEnabled && self.result){
        // console.log("we're enabled and have a result");
        self.getData();
        console.log(self.data);
      }
    }

    self.getData = function() {
      console.log("in getData");
      var URL = "";

      if (self.isJournal()) {
        URL = self.api + "/search?issns=" + self.issn();
      }
      if (self.isArticle()) {
        URL = self.api + "/articles/doi/" + self.doi() + "?include=journal";
      }
      if (URL){
        URL += "&access_token=" + self.apiKey;
        // console.log(URL);
        $http.get(URL).then(function(response) {
          self.data = response.data;
          console.log(self.data);
          if (self.data != {} && self.data.browzineWebLink) {
            self.browzineWebLink = self.data.browzineWebLink;
          }
          // console.log(vm.data);
        }, function (error) {
          console.log(error);
        });
      }
    };

    self.isArticle = function() {
      var validation = false;
      var result = self.result;

      if (result && result.pnx) {
        if (result.pnx.display && result.pnx.display.type) {
          var contentType = result.pnx.display.type[0].trim().toLowerCase();

          if (contentType === "article") {
            validation = true;
          }
        }
      }
      if (validation){
        self.browzineWebLinkText = self.articleBrowZineWebLinkText;
      }
      return validation;
    };

    self.isJournal = function(){
      var validation = false;
      var result = self.result;

      if (result && result.pnx) {
        if (result.pnx.display && result.pnx.display.type) {
          var contentType = result.pnx.display.type[0].trim().toLowerCase();

          if (contentType === "journal") {
            validation = true;
          }
        }
      }
      if (validation) {
        self.browzineWebLinkText = self.journalBrowZineWebLinkText;
      }
      return validation;
    }

    self.getResult = function() {
      return self.prmSearchResultAvailabilityLine.result || self.prmSearchResultAvailabilityLine.item;
    };

    self.directToPDFUrl = function() {
      if (self.data.fullTextFile) {
        return self.data.fullTextFile;
      }
      return null;
    };

    self.doi = function(){
      var doi = "";
      var result = self.result;
      if (result && result.pnx) {
        if (result.pnx.addata && result.pnx.addata.doi) {
          if (result.pnx.addata.doi[0]) {
            doi = result.pnx.addata.doi[0].trim();
          }
        }
      }

      return encodeURIComponent(doi);
    };

    self.issn = function(){
      var issn = "";
      var result = self.result;

      if (result && result.pnx && result.pnx.addata) {
        if (result.pnx.addata.issn) {
          if (result.pnx.addata.issn.length > 1) {
            issn = result.pnx.addata.issn.join(",").trim().replace(/-/g, "");
          } else {
            if (result.pnx.addata.issn[0]) {
              issn = result.pnx.addata.issn[0].trim().replace("-", "");
            }
          }
        }

        if (result.pnx.addata.eissn && !issn) {
          if (result.pnx.addata.eissn.length > 1) {
            issn = result.pnx.addata.eissn.join(",").trim().replace(/-/g, "");
          } else {
            if (result.pnx.addata.eissn[0]) {
              issn = result.pnx.addata.eissn[0].trim().replace("-", "");
            }
          }
        }
      }

      return encodeURIComponent(issn);
    };

  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController',
    template: "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'           ng-if='$ctrl.directToPDFUrl() != null && $ctrl.isArticle() &&              $ctrl.articlePDFDownloadLinkEnabled && $ctrl.browzineEnabled' >\
        <a class='browzine-direct-to-pdf-link' href='{{$ctrl.directToPDFUrl()}}' target='_blank'>\
        <img src='{{$ctrl.pdfIcon}}' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 2.8px;' aria-hidden='true' width='12' height='16' />\
        <span class='browzine-web-link-text'>{{ $ctrl.articlePDFDownloadLinkText }}</span>\
        <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;color: #757575;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
        </a>\
      </div >\
      <div class='browzine' style='line-height: 1.4em;' ng-if='$ctrl.browzineEnabled && (($ctrl.isArticle() && $ctrl.prmSearchResultAvailabilityLine.isFullView) || $ctrl.isJournal()) && $ctrl.data != {}'>\
      <a class='browzine-web-link' href='{{$ctrl.browzineWebLink}}' target='_blank'>\
          <img src='{{$ctrl.bookIcon}}' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/>\
          <span class='browzine-web-link-text'>{{$ctrl.browzineWebLinkText}}</span>\
          <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;color: #757575;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
      </a>\
  </div>\
  "

  });


