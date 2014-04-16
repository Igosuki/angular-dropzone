(function(module) {
try { app = angular.module("ng_dropzone.html"); }
catch(err) { app = angular.module("ng_dropzone.html", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/dropzone-directive.html",
    "<div class=\"alert alert-danger \" ng-show=\"dropzoneAlerts\">\n" +
    "    <div class=\"dropzone\" ng-transclude></div>\n" +
    "    <h4>Dropzone Alerts</h4>\n" +
    "    <ul ng-repeat=\"alert in dropzoneAlerts\">\n" +
    "      <li ng-bind=\"alert\"></li>\n" +
    "    </ul>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);
})();

(function() {
  this.dropzoneModule = angular.module('angular-dropzone', []);

  this.dropzoneModule.directive('ngDropzone', [
    '$http', function($http) {
      var dropzone, dropzoneDefinition;
      dropzone = null;
      dropzoneDefinition = {
        controller: function($scope) {
          return 0;
        },
        restrict: 'E',
        template: 'HTML',
        templateUrl: function(element, attributes) {
          return attributes.template || "ng_dropzone.html";
        },
        transclude: 'element',
        compile: function(tElement, tAttrs, transclude) {
          var compiler;
          Dropzone.autoDiscover = false;
          compiler = {
            pre: function(scope, element, attrs, ctrl) {},
            post: function(scope, element, attrs, ctrl) {
              var url;
              url = element.tagName === 'form' ? element.attrs('url') : attrs['dzUrl'];
              return dropzone = new Dropzone(element, {
                paramName: param_name,
                acceptedFiles: '.jpeg, .jpg, .png, .doc, .xls, .pdf, .odt',
                previewsContainer: '#preview_invoice',
                autoProcessQueue: true,
                url: url,
                clickable: '.dropzone'
              });
            }
          };
          return compiler;
        },
        link: function(scope, element, attrs) {
          dropzone.on("success", function(file) {
            if (!attrs.dzBatch || dropzone.getUploadingFiles().length === 0) {
              return c;
            }
          });
          return dropzone.on("error", function(file) {
            $scope.dropzoneAlerts || ($scope.dropzoneAlerts = []);
            return $scope.dropzoneAlerts.push("Problem lors de l'envoi de " + angular.toJSON(file));
          });
        }
      };
      return dropzoneDefinition;
    }
  ]);

}).call(this);
