@dropzoneModule = angular.module 'angular-dropzone'
@dropzoneModule.constant 'dropzoneConfig', {
  acceptedFiles: '.jpeg, .jpg, .png, .doc, .xls, .pdf, .odt'
  autoDiscover: false
  autoProcessQueue: true
  parallelUploads: 1
  clickable: true
}
@dropzoneModule.directive 'ngDropzone', ['$q', '$parse','$upload', '$timeout', '$compile', '$templateCache', 'dropzoneConfig', '$document',
($q, $parse, $upload, $timeout, $compile, $templateCache, dropzoneConfig, $document) ->
  STATUS = {
    UPLOADING: "uploading"
    PENDING: "pending"
    CANCELED: "canceled"
  }
  dropzoneDefinition =
    controller: ($scope) ->
      $scope.dropzoneAlerts ||= []
      $scope.files = []
      uploadingCount = 0
      self = @
      processQueue = () =>
        if self.config.autoProcessQueue
          $timeout () ->
            return if $scope.files.length is 0
            angular.forEach $scope.files, (file) ->
              if file.status isnt STATUS.UPLOADING && uploadingCount < self.config.parallelUploads
                file.query = uploadFile(file)
                uploadingCount++
            processQueue() if $scope.files.length > uploadingCount
          , 100
      uploadFile = (file) ->
        $upload.upload(
          method: 'POST'
          url: self.url
          file: file
          fileFormDataName: self.paramName
          data: self.params
        ).progress((evt) ->
          file.uploadProgress = parseInt(100.0 * evt.loaded / evt.total)
        ).success((data, headers) ->
          $scope.dzSuccess()(data)
        ).error((response) ->
          if (errorFn = $scope.dzError())
            errorFn(response, $scope.dropzoneAlerts)
          else
            if angular.isArray(response)
              angular.forEach response, (message) ->
                addError(message)
            else if angular.isObject(response)
              angular.forEach response, (value, key) ->
                valueString = if angular.isArray(value) then value.join(", ") else value
                addError("#{key} : #{valueString}")
        ).finally () ->
          self.cancelFile(file)

      addError = (alertMsg) ->
        $scope.dropzoneAlerts.push({type: 'danger', msg: alertMsg})

      @.queue = (files) ->
        angular.forEach files, (file) ->
          $scope.files.push file
          return
        processQueue()
      @params =  {}
      @.setDataField = (fieldElement) ->
        @params[fieldElement.attr('name')] = fieldElement.val()
      @.setField = (fieldElement) ->
        @paramName = fieldElement.attr('name')
      @.addSuccess = (alertMessage) ->
        $scope.$apply () ->
          $scope.dropzoneAlerts.push({type: 'success', msg: alertMessage})
      @.cancelFile = (file) ->
        uploadingCount--
        $scope.files.splice $scope.files.indexOf(file), 1
      return @
    restrict: 'EC'
    templateUrl: (element, attributes) ->
      attributes.template || "src/dropzone-directive.html"
    replace: true
    transclude: true
    scope:
      dzSuccess: '&'
      dzError: '&'
      dzConfig: '@'
    link:
      pre: (scope, element, attrs, ctrl) ->
        scope.dzParamNamePromise = $q.defer()
      post: (scope, element, attrs, ctrl) ->
        hiddenInput = undefined

        ctrl.config = config = angular.extend dropzoneConfig, $parse(attrs.dzConfig)(scope)

        ctrl.url = if element.tagName is 'form' then element.attrs('url') else attrs['dzUrl']

        redirectClick = (evt) ->
          evt.stopPropagation()
          e = $document[0].createEvent("MouseEvents")
          e.initEvent('click', true, true)
          hiddenInput[0].dispatchEvent(e)

        if config.clickable
          createHiddenField = () ->
            hiddenInput.remove() if hiddenInput
            hiddenInput = angular.element $compile($templateCache.get('src/dropzone-file-input.html'))(scope)
            element.append(hiddenInput)
            hiddenInput.bind 'change', () ->
              ctrl.queue hiddenInput[0].files
              createHiddenField()
          createHiddenField()
          if angular.isString config.clickable
            element.querySelectorAll(config.clickable).bind 'click', (evt) ->
              redirectClick(evt)
          else
            element.bind 'click', (evt) ->
              redirectClick(evt)

        element.bind 'dragover dragenter', () ->
          element.addClass 'active'
        element.bind 'dragend dragleave', () ->
          element.removeClass 'active'

        element.bind 'drop', () ->
          dropEvent.stopPropagation();
          dropEvent.preventDefault();
          ctrl.queue dropEvent.originalEvent.dataTransfer.files
  return dropzoneDefinition
]
