@auth ?= {}

@auth.validator = 

  fieldsToValidate: []

  init: (fields) ->
    @fieldsToValidate = fields
    @bindField field for field in @fieldsToValidate

  bindField: (field) ->
    if field.attr('type') is 'checkbox'
      field.on 'change', @prepValidatedField
    else
      field.on 'blur', @prepValidatedField

  prepValidatedField: (e) ->
    auth.validator.validateField $ e.target

  validateField: (field) ->
    valid = true
    parent = field.parent()
    span = parent.find 'span'
    rules = field.attr('data-validation').split '|'
    errorMessages = field.attr('data-validation-errors').split '|'
    errors = []
    i=0;

    for rule in rules
      do (rule) ->
        switch rule
          when "required" then unless field.val().length > 0
            errors.push errorMessages[i]
          when "zip" then unless field.val().match(auth.validator.patterns.zip)
            errors.push errorMessages[i]
          when "email" then unless field.val().match(auth.validator.patterns.email)
            errors.push errorMessages[i]
          when "checked" then unless field.is(':checked')
            errors.push errorMessages[i]
          else
            break;
      i++

    if errors.length
      valid = false
      span.text errorMessages.join '<br>' if span.length > 0
      parent.addClass 'has-error'
    
    else
      span.text('') unless span.length < 1
      parent.removeClass 'has-error'

    valid

  validateForm: ->
    valid = true;
    for field in @fieldsToValidate
      valid = false unless @validateField field
    valid
    
  # @TODO fix/test zip and phone patterns
  patterns:  
    zip: /^([0-9]{5,5})$/i,  
    phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i,
    email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/i