angular.module('browzineThumbnail', [])
    .controller('browzineThumbnailController', ['$scope', function ($scope) {
        var self = this;
        self.$onInit = function () {
            console.log("in browzine thumbnail controller");
            console.log(self.prmSearchResultThumbnailContainer);
        }
    }])
    .component('browzineThumbnail', {
        require: {
            prmSearchResultThumbnailContainer: '^prmSearchResultThumbnailContainer'
        },
        controller: 'browzineThumbnailController'
    });
