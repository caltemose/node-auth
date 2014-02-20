cd ./coffee
echo "building auth.js with coffee"
coffee --watch --join ../public/assets/js/auth.js --compile \
  auth.validator.coffee form.coffee field.coffee errorFlag.coffee submitButton.coffee initForms.coffee &