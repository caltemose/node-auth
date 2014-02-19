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
    oneError = errorMessages.length < rules.length
    errors = []
    i = 0

    for rule in rules

      if rule.match(/^match-/)
        partnerName = rule.substr(6)
        rule = 'match'

      switch rule
        when "required" then unless field.val().length > 0
          if oneError and errors.length < 1
            errors.push errorMessages[0]
          else if not oneError
            errors.push errorMessages[i]
        
        when "zip" then unless field.val().match(auth.validator.patterns.zip)
          if oneError and errors.length < 1 
            errors.push errorMessages[0]
          else if not oneError
            errors.push errorMessages[i]
        
        when "email" then unless field.val().match(auth.validator.patterns.email)
          if oneError and errors.length < 1
            errors.push errorMessages[0]
          else if not oneError
            errors.push errorMessages[i]
        
        when "checked" then unless field.is(':checked')
          if oneError and errors.length < 1 
            errors.push errorMessages[0]
          else if not oneError
            errors.push errorMessages[i]
        
        when "match"
          partner = $('input[name="' + partnerName + '"]')
          if field.val().length >1 and field.val() isnt partner.val() and partner.val().length >1
            if oneError and errors.length < 1 
              errors.push errorMessages[0]
            else if not oneError
              errors.push errorMessages[i]
        else
          break;

      i++

    if errors.length
      valid = false
      span.html errors.join '<br>' if span.length > 0
      parent.addClass 'has-error'
    
    else
      span.html('') unless span.length < 1
      parent.removeClass 'has-error'

    if field.attr('data-match')
      partner = $ 'input[name="' + field.attr('data-match') + '"]'
      auth.validator.validateField partner

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
