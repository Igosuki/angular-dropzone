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
    "");
}]);
})();
