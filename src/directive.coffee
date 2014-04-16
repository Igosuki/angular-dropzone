@dropzoneModule = angular.module 'angular-dropzone', []
@dropzoneModule.directive 'ngDropzone', ['$http', ($http) ->

  dropzone = null

  dropzoneDefinition =
    controller: ($scope) ->
      #controller cn func, may access $scope, $element, $attrs, $transclude
      return 0
    restrict: 'E'
    template: 'HTML'
    templateUrl: (element, attributes) ->
      attributes.template || "ng_dropzone.html"
    transclude: 'element'
    #only use to transform template DOM
    compile: (tElement, tAttrs, transclude) ->
      Dropzone.autoDiscover = false

      compiler =
        pre: (scope, element, attrs, ctrl) ->
          #not safe for DOM transformation
          #
        post: (scope, element, attrs, ctrl) ->
          url = if element.tagName is 'form' then element.attrs('url') else attrs['dzUrl']
          dropzone = new Dropzone element,
            paramName: param_name
            acceptedFiles: '.jpeg, .jpg, .png, .doc, .xls, .pdf, .odt'
            previewsContainer: '#preview_invoice'
            autoProcessQueue: true
            url: url
            clickable: '.dropzone'
      return compiler

    link: (scope, element, attrs) ->
      dropzone.on "success", (file) ->
        if !attrs.dzBatch or dropzone.getUploadingFiles().length is 0
          c
      dropzone.on "error", (file) ->
        $scope.dropzoneAlerts ||= []
        $scope.dropzoneAlerts.push("Problem lors de l'envoi de " + angular.toJSON(file))


  return dropzoneDefinition
]
