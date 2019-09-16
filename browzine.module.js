angular.module('browzineMod', [])
  .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
    var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    urlWhitelist.push('https://public-api.thirdiron.com/public/v1/' + '**');
    $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  }])
  .controller('browzineController', ['$scope', '$http', '$window', function ($scope, $http, $window) {
    var self = this;

    self.$onInit = function () {
      self.browzineEnabled = true;
      self.browzineWebLinkText = "";
      self.data = null;
      self.result = self.getResult();
      self.browzineWebLink = null;
      self.isJournalTF = false;
      self.isArticleTF = false;
      self.response = null;
      self.journal = null;
      self.doi = "";
      self.issn = "";
      self.directToPDFUrl = "";
      if(self.browzineEnabled && self.result && (self.isArticle() || self.isJournal())){
        if (self.isArticleTF){
          self.browzineWebLinkText = $window.browzine.articleBrowZineWebLinkText;
        } else if (self.isJournalTF){
          self.browzineWebLinkText = $window.browzine.journalBrowZineWebLinkText;
        }
        self.endpoint = self.getEndpoint();
        if (self.endpoint){
          self.getFromEndpoint(self.endpoint);
        }
      }
    }

    self.getFromEndpoint = function(){
      $http.get(self.endpoint).then(function (response) {
        self.response = response;
        self.data = self.getData(response);
        if (!self.journal) {
          self.journal = self.getIncludedJournal();
        }
        self.browzineEnabled = self.getBrowzineEnabled();
        self.browzineWebLink = self.getBrowzineWebLink();
        self.directToPDFUrl = self.getDirectToPDFUrl();
        self.articlePDFDownloadLinkEnabled = $window.browzine.articlePDFDownloadLinkEnabled;
        self.articlePDFDownloadLinkText = $window.browzine.articlePDFDownloadLinkText;
        self.coverImageUrl = self.getCoverImageUrl(scope, self.data, self.journal);
        self.defaultCoverImage = self.isDefaultCoverImage(self.coverImageUrl);

        if (coverImageUrl && !defaultCoverImage && showJournalCoverImages()) {
          (function poll() {
            var elementParent = getElementParent(element);
            var coverImages = elementParent.querySelectorAll("prm-search-result-thumbnail-container img");

            if (coverImages[0]) {
              if (coverImages[0].className.indexOf("fan-img") > -1) {
                Array.prototype.forEach.call(coverImages, function (coverImage) {
                  coverImage.src = coverImageUrl;
                });
              } else {
                requestAnimationFrame(poll);
              }
            }
          })();
        }

      }, function (error) {
        console.log(error);
      });
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
      self.isArticleTF = validation;
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
      self.isJournalTF = validation;
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

      if (self.isArticleTF) {
        if(!self.doi){self.getDoi()}
        if(self.doi){
          endpoint = $window.browzine.api + "/articles/doi/" + self.doi + "?include=journal";
        }
      }

      if (self.isJournalTF) {
        if(!self.issn){self.getIssn()}
        if(self.issn){
          endpoint = $window.browzine.api + "/search?issns=" + self.issn;
        }
      }

      if (endpoint){
        endpoint += "&access_token=" + $window.browzine.apiKey;
      }

      return endpoint;
    }

    self.getData = function(){
      var data = {};
      var response = self.response;
      if (Array.isArray(response.data.data)) {
        data = response.data.data.filter(function (journal) {
          return journal.browzineEnabled === true;
        }).pop();
      } else {
        data = response.data.data;
      }

      return data;
    }

    self.getIncludedJournal = function(){
      var response = self.response.data;
      var journal = null;
      if (response.included) {
        journal = Array.isArray(response.included) ? response.included[0] : response.included;
      }
      return journal;
    }

    self.getBrowzineWebLink = function(){
      var data = self.data;
      var browzineWebLink = null;
      if (data && data.browzineWebLink) {
        browzineWebLink = data.browzineWebLink;
      }
      return browzineWebLink;
    }

    self.getCoverImageUrl = function(data){
      var coverImageUrl = null;

      if (self.isJournalTF) {
        if (self.data && self.data.coverImageUrl) {
          self.coverImageUrl = self.data.coverImageUrl;
        }
      }

      if (self.isArticleTF) {
        if (self.journal && self.journal.coverImageUrl) {
          self.coverImageUrl = self.journal.coverImageUrl;
        }
      }
      self.coverImageUrl = coverImageUrl;
      return coverImageUrl;
    }

    self.getBrowzineEnabled = function(){
      var browzineEnabled = false;
      var data = self.data;
      var journal = self.journal;

      if (self.isJournalTF) {
        if (data && data.browzineEnabled) {
          browzineEnabled = data.browzineEnabled;
        }
      }

      if (self.isArticleTF) {
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
      if (self.isArticleTF && data) {
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
    template: "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'           ng-if='$ctrl.isArticleTF && $ctrl.browzineEnabled && $ctrl.articlePDFDownloadLinkEnabled && $ctrl.directToPDFUrl != null' >\
        <a class='browzine-direct-to-pdf-link' href='{{$ctrl.directToPDFUrl}}' target='_blank'>\
        <img src='https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 2.8px;' aria-hidden='true' width='12' height='16' />\
        <span class='browzine-web-link-text'>{{ $ctrl.articlePDFDownloadLinkText }}</span>\
        <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;color: #757575;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
        </a>\
      </div >\
      <div class='browzine' style='line-height: 1.4em;' ng-if='$ctrl.browzineEnabled && (($ctrl.isArticleTF && $ctrl.prmSearchResultAvailabilityLine.isFullView) || $ctrl.isJournalTF) && $ctrl.browzineWebLink'>\
      <a class='browzine-web-link' href='{{$ctrl.browzineWebLink}}' target='_blank'>\
          <img src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/>\
          <span class='browzine-web-link-text'>{{$ctrl.browzineWebLinkText}}</span>\
          <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;color: #757575;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>\
      </a>\
  </div>\
  "
  });
