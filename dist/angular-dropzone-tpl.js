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
    "      <div ng-repeat=\"file in files\" dz-file-preview>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);
})();

(function(module) {
try { app = angular.module("angular-dropzone-tpls"); }
catch(err) { app = angular.module("angular-dropzone-tpls", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/dropzone-file-input.html",
    "<input type=\"file\" style=\"top:0; left: 0; height: 0; width: 0; visibility: hidden; position: absolute;\" multiple=\"multiple\" accepted=\"{{acceptedFiles}}\" />\n" +
    "");
}]);
})();

(function(module) {
try { app = angular.module("angular-dropzone-tpls"); }
catch(err) { app = angular.module("angular-dropzone-tpls", []); }
app.run(["$templateCache", function($templateCache) {
  "use strict";
  $templateCache.put("src/dropzone-file-preview.html",
    "<div id=\"template\" class=\"file-row\">\n" +
    "  <div>\n" +
    "      <p class=\"name\" ng-bind=\"\"></p>\n" +
    "      <strong class=\"error text-danger\" ng-bind=\"dzFile.errors\"></strong>\n" +
    "  </div>\n" +
    "  <div>\n" +
    "    <progressbar class=\"progress-striped active text-center\" value=\"file.uploadProgress\" type=\"{{success}}\">\n" +
    "      <span class=\"strong\" ng-bind=\"dzFile.name\"></span>\n" +
    "      <span class=\"strong\"> : </span>\n" +
    "      <span class=\"strong\" ng-bind=\"dzFile.size|bytes:'MB'\"></span>\n" +
    "    </progressbar>\n" +
    "    <a class=\"javascript:void(0)\" ng-click=\"remove()\" class=\"text-warning cancel\">\n" +
    "        <i class=\"fa fa-ban fa-1-5x\"></i>\n" +
    "    </a>\n" +
    "    <a class=\"javascript:void(0)\" ng-click=\"remove()\" class=\"text-danger delete\">\n" +
    "      <i class=\"fa fa-trash-o fa-1-5x\"></i>\n" +
    "    </a>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);
})();

(function() {
  angular.module('angular-dropzone', ['angular-dropzone-tpls', 'angularFileUpload']);

}).call(this);

(function() {
  this.dropzoneModule = angular.module('angular-dropzone');

  this.dropzoneModule.directive('dzDataField', [
    '$http', function($http) {
      var dzDataFieldDefinition;
      dzDataFieldDefinition = {
        restrict: 'AE',
        require: '^ngDropzone',
        link: {
          post: function(scope, element, attrs, ngDropzone) {
            return ngDropzone.setDataField(element);
          }
        }
      };
      return dzDataFieldDefinition;
    }
  ]);

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

  this.dropzoneModule.directive('dzFilePreview', [
    '$http', function($http) {
      return {
        restrict: 'A',
        require: '^ngDropzone',
        templateUrl: 'src/dropzone-file-preview.html',
        replace: true,
        link: function(scope, element, attrs, ngDropzone) {
          return scope.remove = function() {
            return ngDropzone.cancelFile(scope.file);
          };
        }
      };
    }
  ]);

}).call(this);

(function() {


}).call(this);

(function() {
  this.dropzoneModule = angular.module('angular-dropzone');

  this.dropzoneModule.constant('dropzoneConfig', {
    acceptedFiles: '.jpeg, .jpg, .png, .doc, .xls, .pdf, .odt',
    autoDiscover: false,
    autoProcessQueue: true,
    parallelUploads: 1,
    clickable: true
  });

  this.dropzoneModule.directive('ngDropzone', [
    '$q', '$parse', '$upload', '$timeout', '$compile', '$templateCache', 'dropzoneConfig', function($q, $parse, $upload, $timeout, $compile, $templateCache, dropzoneConfig) {
      var STATUS, dropzoneDefinition;
      STATUS = {
        UPLOADING: "uploading",
        PENDING: "pending",
        CANCELED: "canceled"
      };
      dropzoneDefinition = {
        controller: function($scope) {
          var addError, processQueue, self, uploadFile, uploadingCount;
          $scope.dropzoneAlerts || ($scope.dropzoneAlerts = []);
          $scope.files = [];
          uploadingCount = 0;
          self = this;
          processQueue = (function(_this) {
            return function() {
              if (self.config.autoProcessQueue) {
                return $timeout(function() {
                  if ($scope.files.length === 0) {
                    return;
                  }
                  angular.forEach($scope.files, function(file) {
                    if (file.status !== STATUS.UPLOADING && uploadingCount < self.config.parallelUploads) {
                      file.query = uploadFile(file);
                      return uploadingCount++;
                    }
                  });
                  if ($scope.files.length > uploadingCount) {
                    return processQueue();
                  }
                }, 100);
              }
            };
          })(this);
          uploadFile = function(file) {
            return $upload.upload({
              method: 'POST',
              url: self.url,
              file: file,
              fileFormDataName: self.paramName,
              data: self.params
            }).progress(function(evt) {
              return file.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, headers) {
              self.cancelFile(file);
              return $scope.dzSuccess()(data);
            }).error(function(response) {
              if (response.messages) {
                return angular.forEach(response.messages, function(k, v) {
                  return addError(k + " : " + angular.toJson(v));
                });
              } else {
                return addError("Problem sending " + angular.toJson(response));
              }
            });
          };
          addError = function(alertMsg) {
            return $scope.dropzoneAlerts.push({
              type: 'danger',
              msg: alertMsg
            });
          };
          this.queue = function(files) {
            angular.forEach(files, function(file) {
              $scope.files.push(file);
            });
            return processQueue();
          };
          this.params = {};
          this.setDataField = function(fieldElement) {
            return this.params[fieldElement.attr('name')] = fieldElement.val();
          };
          this.setField = function(fieldElement) {
            return this.paramName = fieldElement.attr('name');
          };
          this.addSuccess = function(alertMessage) {
            return $scope.$apply(function() {
              return $scope.dropzoneAlerts.push({
                type: 'success',
                msg: alertMessage
              });
            });
          };
          this.cancelFile = function(file) {
            uploadingCount--;
            return $scope.files.splice($scope.files.indexOf(file), 1);
          };
          return this;
        },
        restrict: 'EC',
        templateUrl: function(element, attributes) {
          return attributes.template || "src/dropzone-directive.html";
        },
        replace: true,
        transclude: true,
        scope: {
          dzSuccess: '&',
          dzConfig: '@'
        },
        link: {
          pre: function(scope, element, attrs, ctrl) {
            return scope.dzParamNamePromise = $q.defer();
          },
          post: function(scope, element, attrs, ctrl) {
            var config, createHiddenField, hiddenInput, redirectClick;
            hiddenInput = void 0;
            ctrl.config = config = angular.extend(dropzoneConfig, $parse(attrs.dzConfig)(scope));
            ctrl.url = element.tagName === 'form' ? element.attrs('url') : attrs['dzUrl'];
            redirectClick = function(evt) {
              evt.stopPropagation();
              return hiddenInput[0].dispatchEvent(new Event('click'));
            };
            if (config.clickable) {
              createHiddenField = function() {
                if (hiddenInput) {
                  hiddenInput.remove();
                }
                hiddenInput = angular.element($compile($templateCache.get('src/dropzone-file-input.html'))(scope));
                element.append(hiddenInput);
                return hiddenInput.bind('change', function() {
                  ctrl.queue(hiddenInput[0].files);
                  return createHiddenField();
                });
              };
              createHiddenField();
              if (angular.isString(config.clickable)) {
                element.querySelectorAll(config.clickable).bind('click', function(evt) {
                  return redirectClick(evt);
                });
              } else {
                element.bind('click', function(evt) {
                  return redirectClick(evt);
                });
              }
            }
            element.bind('dragover dragenter', function() {
              return element.addClass('active');
            });
            element.bind('dragend dragleave', function() {
              return element.removeClass('active');
            });
            return element.bind('drop', function() {
              dropEvent.stopPropagation();
              dropEvent.preventDefault();
              return ctrl.queue(dropEvent.originalEvent.dataTransfer.files);
            });
          }
        }
      };
      return dropzoneDefinition;
    }
  ]);

}).call(this);
