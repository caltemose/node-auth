@auth ?= {}

class Validator

  constructor: ()->
    return @singleton_instance unless !@singleton_instance
    @singleton_instance = @

  test: (method,input)->
    if @[method]
      return @[method] input
    else
      return @not_empty input

  null_selection: "-1"


  # --- VALIDATION METHODS   ----------------------------------

  not_empty: (input) ->
    input.val().length > 0
  
  email: (input) ->
    val = input.val()
    val.match(@patterns.email) and val.length <= 54

  checked: (input) ->
    input.prop 'checked'


  # --- PATTERNS   --------------------------------------------

  zip: /^([0-9]{5,5})$/i,  
  phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i,
  email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/i


@auth.validator = new Validator()

