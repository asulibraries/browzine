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
      self.data = null;
      self.pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
      self.bookIcon = "https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg";
      self.apiKey = "a1d2656d-d27c-466f-b549-f14a645a2024";
      self.api = "https://public-api.thirdiron.com/public/v1/libraries/158";
      console.log("initializing browzine");
      // console.log(self.prmSearchResultAvailabilityLine);
      // console.log(self.browzineEnabled);
      self.result = self.getResult();
      self.browzineWebLink = null;
      self.isJournal = null;
      self.isArticle = null;
      self.response = null;
      self.journal = null;
      self.doi = "";
      self.issn = "";
      if(self.browzineEnabled && self.result && (self.isArticle() || self.isJournal())){
        console.log("we're enabled and have a result");
        // self.getData();
        // console.log(self.data);
        self.endpoint = self.getEndpoint();
        if (self.endpoint){
          $http.get(self.endpoint).then(function(response){
            console.log("we got the data from browzine");
            console.log(response.data);
            self.data = response.data;
            self.response = response;
            console.log(self.response);
          }, function(error){
            console.log(error);
          });
        }
      }
    }

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
      self.isArticle = validation;
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
      self.isJournal = validation;
      return validation;
    }

    self.getResult = function() {
      return self.prmSearchResultAvailabilityLine.result || self.prmSearchResultAvailabilityLine.item;
    };

    self.getIssn = function(){
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
      self.issn = encodeURIComponent(issn);
      return encodeURIComponent(issn);
    }

    self.getDoi = function(){
      var doi = "";
      var result = self.result;

      if (result && result.pnx) {
        if (result.pnx.addata && result.pnx.addata.doi) {
          if (result.pnx.addata.doi[0]) {
            doi = result.pnx.addata.doi[0].trim();
          }
        }
      }
      self.doi = encodeURIComponent(doi);
      return encodeURIComponent(doi);;
    }

    self.getEndpoint = function(){
      var endpoint = "";

      if (self.isArticle) {
        var doi = self.doi;
        endpoint = api + "/articles/doi/" + doi + "?include=journal";
      }

      if (self.isJournal) {
        var issn = self.issn;
        endpoint = api + "/search?issns=" + issn;
      }

      endpoint += "&access_token=" + apiKey;

      return endpoint;
    }

    self.getData = function(){
      var data = {};
      var response = self.response;

      if (Array.isArray(response.data)) {
        data = response.data.filter(function (journal) {
          return journal.browzineEnabled === true;
        }).pop();
      } else {
        data = response.data;
      }

      return data;
    }

    self.getIncludedJournal = function(){
      var response = self.response;
      var journal = null;

      if (response.included) {
        journal = Array.isArray(response.included) ? response.included[0] : response.included;
      }
      self.journal = journal;
      return journal;
    }

    self.getBrowzineWebLink = function(){
      var data = self.data;
      var browzineWebLink = null;

      if (data && data.browzineWebLink) {
        browzineWebLink = data.browzineWebLink;
      }
      self.browzineWebLink = browzineWebLink;
      return browzineWebLink;
    }

    self.getCoverImage = function(){
      var data = self.data;
      var coverImageUrl = null;
      var journal = self.journal;
      if(!journal){
        journal = self.getIncludedJournal();
      }

      if (self.isJournal) {
        if (data && data.coverImageUrl) {
          coverImageUrl = data.coverImageUrl;
        }
      }

      if (self.isArticle) {
        if (journal && journal.coverImageUrl) {
          coverImageUrl = journal.coverImageUrl;
        }
      }

      return coverImageUrl;
    }

    self.getBrowzineEnabled = function(){
      var browzineEnabled = false;
      var data = self.data;
      var journal = self.journal;
      if (!journal) {
        journal = self.getIncludedJournal();
      }

      if (self.isJournal) {
        if (data && data.browzineEnabled) {
          browzineEnabled = data.browzineEnabled;
        }
      }

      if (self.isArticle) {
        if (journal && journal.browzineEnabled) {
          browzineEnabled = journal.browzineEnabled;
        }
      }

      return browzineEnabled;
    }

    self.isDefaultCoverImage = function(coverImageUrl) {
      var defaultCoverImage = false;

      if (coverImageUrl && coverImageUrl.toLowerCase().indexOf("default") > -1) {
        defaultCoverImage = true;
      }

      return defaultCoverImage;
    }

    self.getDirectToPDFUrl = function(){
      var directToPDFUrl = null;
      var data = self.data;

      if (self.isArticle) {
        if (data.fullTextFile) {
          directToPDFUrl = data.fullTextFile;
        }
      }

      return directToPDFUrl;
    }

    self.isFiltered = function() {
      var validation = false;
      var result = self.result;

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

  }])
  .component('browzineMod', {
    require: {
      prmSearchResultAvailabilityLine: '^prmSearchResultAvailabilityLine'
    },
    controller: 'browzineController',
    template: "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'           ng-if='$ctrl.getDirectToPDFUrl() && $ctrl.isArticle &&              $ctrl.articlePDFDownloadLinkEnabled && $ctrl.getBrowzineEnabled()' >\
        <a class='browzine-direct-to-pdf-link' href='{{$ctrl.directToPDFUrl()}}' target='_blank'>\
        <img src='{{$ctrl.pdfIcon}}' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 2.8px;' aria-hidden='true' width='12' height='16' />\
        <span class='browzine-web-link-text'>{{ $ctrl.articlePDFDownloadLinkText }}</span>\
        <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;color: #757575;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
        </a>\
      </div >\
      <div class='browzine' style='line-height: 1.4em;' ng-if='$ctrl.browzineEnabled && (($ctrl.isArticle && $ctrl.prmSearchResultAvailabilityLine.isFullView) || $ctrl.isJournal) && $ctrl.getBrowzineWebLink() != null'>\
      <a class='browzine-web-link' href='{{$ctrl.browzineWebLink}}' target='_blank'>\
          <img src='{{$ctrl.bookIcon}}' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/>\
          <span class='browzine-web-link-text'>{{$ctrl.browzineWebLinkText}}</span>\
          <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;color: #757575;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
      </a>\
  </div>\
  "

  });


