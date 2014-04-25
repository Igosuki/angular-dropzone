@dropzoneModule = angular.module 'angular-dropzone'
@dropzoneModule.directive 'dropzonePreview', ['$http', ($http) ->
  dzFieldDefinition =
    restrict: 'C'
    require: '^ngDropzone'
    link:
      post: (scope, element, attrs, ngDropzone) ->
        ngDropzone.setPreviewZone(element[0])
  return dzFieldDefinition
]

