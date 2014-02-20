class Form

  constructor: (@house) ->
    self = @
    @fields = []
    # @is_activated = true

    $('input, select', @house).focus  -> $('body').trigger "fieldchange"
    
    bound_fields = @fields

    # console.log $('input', @house)

    $('input', @house).each ->
      unless $(@).attr('type') is 'submit'
        bound_fields.push new Field $(@), self
    
    # @submit_button = new SubmitButton $('[type="submit"]', @house), @form, true
    
    @house.submit @process_submission
    # @post = -> false
    @house.on 'reset_form', @reset


  process_submission: =>
    return true
    # if all fields are valid return @post()
    # otherwise return false

    # return false unless @current_fieldset().is_valid()
    # unless @current_fieldset_index is @fieldsets.length - 1 
    #   @advance_to_next_fieldset()
    #   false
    # else
    #   return @post()
    # true

  reset: =>
    for field in @fields
      field.reset()
    # body.unbind fieldchange, click, focus, keyup
    # trigger 'value_rejected' on first Field @house
