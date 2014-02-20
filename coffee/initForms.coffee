if auth.selections and auth.selections.forms
  auth.selections.forms.each ->
    form = new Form $(@)