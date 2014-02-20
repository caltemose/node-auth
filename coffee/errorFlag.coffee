class ErrorFlag

  constructor: (@field) -> 

  reveal: =>
    @build_flag()   
    @flag.addClass "visible"

  conceal: =>
    @build_flag()
    @flag.removeClass "visible"

  build_flag: ->
    if @flag is undefined
      @flag = $('<span class="error"></span>', {css: "display: none;"})
        .text @field.error_message
      # if @field.house.data().validate == 'radio'
      #   @flag.insertAfter @field.house.find('p')
      # else
      @flag.insertAfter @field.house

    @flag
