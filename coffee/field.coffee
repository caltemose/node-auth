class Field

  constructor: (@house) ->
    @input = @house #$('input,select', @house)
    console.log 'Field.constructor() ', @input
    # @input.not('[type="radio"]')
    #   .filter(->!$(@).data().wrapped)
    #   .data('wrapped', true).wrap '<div class="input" />'
    #below we account for the ".com" button present on email fields in Samsung/Android...
    #@field_update_event = if @input[0].name.match("email") then "keyup change" else "keyup"
    @field_update_event = "keyup"
    @field_update_event = "change" if @input[0]?.type is "checkbox" or @input[0]?.type is "radio"
    @input
      .bind(@field_update_event, @check_value)
      .focus(@focus)
      .blur @blur
    @extract_configuration()
    #@house.add(@input).data "field", @
    @house.data "field", @

  focus: =>
    console.log 'Field.focus()'
    @house.addClass "focus"

  blur: (event) =>
    console.log 'Field.blur()'
    auth.selections.body?.trigger "field_edited"
    @house.removeClass "focus"

  extract_configuration: ->
    d = @house.data()
    @validation_method = d.validation or false
    @error_message = d.validationErrors or false
    @requires_validation = @validation_method or @house.is '.required'
    @error_flag = new ErrorFlag @

  check_value: (event) =>
    console.log 'Field.check_value()'
    event_type = event?.type
    if @requires_validation
      if @is_valid()
        @accept_value()         
      else 
        @reject_value !event or event_type is "blur"    
      # if @field_update_event.indexOf(event_type) >= 0 then @fieldset.update_progression event
    auth.selections.body?.trigger "field_edited"


  is_valid: ->
    #input = if @input.is(':focus') then @input else @mask.unmasked_input
    @valid = auth.validator.test @validation_method, @input

  accept_value: ->
    @required ?= @house.is ".required"
    @house.removeClass('field-with-errors')
    if @required or @valid and @input.val().length
      @house.addClass 'completed'
    else 
      @house.removeClass 'completed'
    @error_flag.conceal()
    @house.trigger "value_accepted"

  reject_value: (apply_error_state) ->
    @house
      .addClass(if apply_error_state then 'field-with-errors' else null)
      .removeClass 'completed'
    @error_flag.reveal() if apply_error_state
    @house.trigger "value_rejected"

  report_errors: ->
    if @valid or !@requires_validation then null else @error_message or "invalid field"

  reset: ->
    @input.not('input:radio, input:checkbox').val('').blur()
    if @mask
      @mask.reset()
    @house.removeClass 'completed field-with-errors'
    @error_flag.conceal()