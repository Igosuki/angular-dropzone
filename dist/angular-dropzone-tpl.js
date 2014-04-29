(function(module) {
try { app = angular.module("angular-dropzone-tpls"); }
catch(err) { app = angular.module("angular-dropzone-tpls", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/dropzone-directive.html",
    "<div class=\"dropzone-container\">\n" +
    "  <div ng-show=\"dropzoneAlerts.length > 0\">\n" +
    "    <div class=\"alert alert-{{alert.type}}\" ng-repeat=\"alert in dropzoneAlerts\">\n" +
    "      <ul>\n" +
    "        <li>\n" +
    "          <span ng-bind=\"alert.msg|limitTo:80\"></span>\n" +
    "        </li>\n" +
    "      </ul>\n" +
    "      <a class=\"close\" ng-href=\"javascript:void(0)\" ng-click=\"dropzoneAlerts.splice($index, 1)\" >\n" +
    "        <i class=\"fa fa-times\"></i>\n" +
    "      </a>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"dropzone\">\n" +
    "    <div class=\"dropzone-inner\" ng-transclude>\n" +
    "    </div>\n" +
    "    <div class=\"dropzone-preview\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);
})();

(function() {
  angular.module('angular-dropzone', ['angular-dropzone-tpls']);

}).call(this);

(function() {
  this.dropzoneModule = angular.module('angular-dropzone');

  this.dropzoneModule.directive('dzField', [
    '$http', function($http) {
      var dzFieldDefinition;
      dzFieldDefinition = {
        restrict: 'AE',
        require: '^ngDropzone',
        link: {
          post: function(scope, element, attrs, ngDropzone) {
            return ngDropzone.setField(element);
          }
        }
      };
      return dzFieldDefinition;
    }
  ]);

}).call(this);

(function() {
  this.dropzoneModule = angular.module('angular-dropzone');

  this.dropzoneModule.directive('dropzonePreview', [
    '$http', function($http) {
      var dzFieldDefinition;
      dzFieldDefinition = {
        restrict: 'C',
        require: '^ngDropzone',
        link: {
          post: function(scope, element, attrs, ngDropzone) {
            return ngDropzone.setPreviewZone(element[0]);
          }
        }
      };
      return dzFieldDefinition;
    }
  ]);

}).call(this);

(function() {
  this.dropzoneModule = angular.module('angular-dropzone');

  this.dropzoneModule.directive('ngDropzone', [
    '$q', '$parse', '$http', '$timeout', function($q, $parse, $http, $timeout) {
      var dropzoneDefinition;
      Dropzone.autoDiscover = false;
      dropzoneDefinition = {
        controller: [
          '$scope', function($scope) {
            $scope.dropzoneAlerts || ($scope.dropzoneAlerts = []);
            this.setField = function(fieldElement) {
              $scope.dzField = fieldElement;
              return $scope.paramName = fieldElement.attr('name');
            };
            this.setPreviewZone = function(zone) {
              return $scope.dzPreviewZone = zone;
            };
            this.addError = function(alertMessage) {
              return $scope.$apply(function() {
                return $scope.dropzoneAlerts.push({
                  type: 'danger',
                  msg: alertMessage
                });
              });
            };
            this.addSuccess = function(alertMessage) {
              return $scope.$apply(function() {
                return $scope.dropzoneAlerts.push({
                  type: 'success',
                  msg: alertMessage
                });
              });
            };
            return this;
          }
        ],
        restrict: 'EC',
        templateUrl: function(element, attributes) {
          return attributes.template || "src/dropzone-directive.html";
        },
        replace: true,
        transclude: true,
        scope: {
          dzSuccess: '&'
        },
        link: {
          pre: function(scope, element, attrs, ctrl) {
            return scope.dzParamNamePromise = $q.defer();
          },
          post: function(scope, element, attrs, ctrl) {
            var url;
            url = element.tagName === 'form' ? element.attrs('url') : attrs['dzUrl'];
            return $timeout(function() {
              var dropzone, dzOptions;
              dzOptions = {
                paramName: attrs.dzField || scope.dzField.attr('name'),
                acceptedFiles: '.jpeg, .jpg, .png, .doc, .xls, .pdf, .odt',
                previewsContainer: scope.dzPreviewZone,
                autoProcessQueue: true,
                url: url,
                clickable: true,
                withCredentials: true,
                headers: $http.defaults.headers.common
              };
              if (attrs.dzOptions) {
                dzOptions = angular.extend(dzOptions, $parse(attrs.dzOptions)(scope));
              }
              dropzone = new Dropzone(element[0], dzOptions);
              dropzone.on("success", function(file, response) {
                var successCb;
                successCb = scope.dzSuccess();
                if (angular.isFunction(successCb)) {
                  successCb(response);
                }
                if (!attrs.dzBatch || dropzone.getUploadingFiles().length === 0) {
                  return ctrl.addSuccess(attrs.dzSuccessMsg || "All files sent !");
                }
              });
              return dropzone.on("error", function(file) {
                if (file.xhr.response.messages) {
                  return angular.forEach(file.xhr.response.messages, function(k, v) {
                    return ctrl.addError(k + " : " + angular.toJson(v));
                  });
                } else {
                  return ctrl.addError("Problem sending " + angular.toJson(file.xhr.response));
                }
              }, 0);
            });
          }
        }
      };
      return dropzoneDefinition;
    }
  ]);

}).call(this);
