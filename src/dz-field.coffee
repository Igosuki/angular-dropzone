@dropzoneModule = angular.module 'angular-dropzone'
@dropzoneModule.directive 'dzField', ['$http', ($http) ->
  dzFieldDefinition =
    restrict: 'AE'
    require: '^ngDropzone'
    link:
      post: (scope, element, attrs, ngDropzone) ->
        ngDropzone.setField(element)
  return dzFieldDefinition
]
