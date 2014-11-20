@dropzoneModule = angular.module 'angular-dropzone'
@dropzoneModule.directive 'dzDataField', ['$http', ($http) ->
  dzDataFieldDefinition =
    restrict: 'AE'
    require: '^ngDropzone'
    link:
      post: (scope, element, attrs, ngDropzone) ->
        ngDropzone.setDataField(element)
  return dzDataFieldDefinition
]
