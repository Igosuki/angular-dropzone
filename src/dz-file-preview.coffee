@dropzoneModule = angular.module 'angular-dropzone'
@dropzoneModule.directive 'dzFilePreview', ['$http', ($http) ->
    restrict: 'A'
    require: '^ngDropzone'
    templateUrl: 'src/dropzone-file-preview.html'
    replace: true
    link: (scope, element, attrs, ngDropzone) ->
      scope.remove = () ->
        ngDropzone.cancelFile(scope.file)
]

