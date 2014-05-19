@dropzoneModule = angular.module 'angular-dropzone'
@dropzoneModule.directive 'ngDropzone', ['$q', '$parse','$http', '$timeout', ($q, $parse, $http, $timeout) ->
  Dropzone.autoDiscover = false
  dropzoneDefinition =
    controller: ['$scope', ($scope) ->
      $scope.dropzoneAlerts ||= []
      @.setField = (fieldElement) ->
        $scope.dzField = fieldElement
        $scope.paramName = fieldElement.attr('name')
      @.setPreviewZone = (zone) ->
        $scope.dzPreviewZone = zone
      @.addError = (alertMessage) ->
        $scope.$apply () ->
          $scope.dropzoneAlerts.push({type: 'danger', msg: alertMessage})
      @.addSuccess = (alertMessage) ->
        $scope.$apply () ->
          $scope.dropzoneAlerts.push({type: 'success', msg: alertMessage})

      return @
    ]
    restrict: 'EC'
    templateUrl: (element, attributes) ->
      attributes.template || "src/dropzone-directive.html"
    replace: true
    transclude: true
    scope:
      dzSuccess: '&'
    link:
      pre: (scope, element, attrs, ctrl) ->
        scope.dzParamNamePromise = $q.defer()
      post: (scope, element, attrs, ctrl) ->

        url = if element.tagName is 'form' then element.attrs('url') else attrs['dzUrl']
        $timeout () ->
          dzOptions =
            paramName: attrs.dzField || scope.dzField.attr('name')
            acceptedFiles: '.jpeg, .jpg, .png, .doc, .xls, .pdf, .odt'
            previewsContainer: scope.dzPreviewZone
            autoProcessQueue: true
            url: url
            clickable: true
            withCredentials: true
            headers: $http.defaults.headers.common
          if attrs.dzOptions
            dzOptions = angular.extend(dzOptions, $parse(attrs.dzOptions)(scope))
          dropzone = new Dropzone element[0], dzOptions
          dropzone.on "success", (file, response) ->
            successCb = scope.dzSuccess()
            if angular.isFunction(successCb)
              successCb(response)
            # if !attrs.dzBatch or dropzone.getUploadingFiles().length is 0
              # ctrl.addSuccess(attrs.dzSuccessMsg or "All files sent !")
            return
          dropzone.on "error", (file) ->
            if file.xhr.response.messages
              angular.forEach file.xhr.response.messages, (k, v) ->
                ctrl.addError(k + " : " + angular.toJson(v))
            else
              ctrl.addError("Problem sending " + angular.toJson(file.xhr.response))
          , 0
  return dropzoneDefinition
]
