// Generated by CoffeeScript 1.6.3
(function() {
  if (this.auth == null) {
    this.auth = {};
  }

  this.auth.validator = {
    fieldsToValidate: [],
    init: function(fields) {
      var field, _i, _len, _ref, _results;
      this.fieldsToValidate = fields;
      _ref = this.fieldsToValidate;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        _results.push(this.bindField(field));
      }
      return _results;
    },
    bindField: function(field) {
      if (field.attr('type') === 'checkbox') {
        return field.on('change', this.prepValidatedField);
      } else {
        return field.on('blur', this.prepValidatedField);
      }
    },
    prepValidatedField: function(e) {
      return auth.validator.validateField($(e.target));
    },
    validateField: function(field) {
      var errorMessages, errors, i, oneError, parent, partner, partnerName, rule, rules, span, valid, _i, _len;
      valid = true;
      parent = field.parent();
      span = parent.find('span');
      rules = field.attr('data-validation').split('|');
      errorMessages = field.attr('data-validation-errors').split('|');
      oneError = errorMessages.length < rules.length;
      errors = [];
      i = 0;
      for (_i = 0, _len = rules.length; _i < _len; _i++) {
        rule = rules[_i];
        if (rule.match(/^match-/)) {
          partnerName = rule.substr(6);
          rule = 'match';
        }
        switch (rule) {
          case "required":
            if (!(field.val().length > 0)) {
              if (oneError && errors.length < 1) {
                errors.push(errorMessages[0]);
              } else if (!oneError) {
                errors.push(errorMessages[i]);
              }
            }
            break;
          case "zip":
            if (!field.val().match(auth.validator.patterns.zip)) {
              if (oneError && errors.length < 1) {
                errors.push(errorMessages[0]);
              } else if (!oneError) {
                errors.push(errorMessages[i]);
              }
            }
            break;
          case "email":
            if (!field.val().match(auth.validator.patterns.email)) {
              if (oneError && errors.length < 1) {
                errors.push(errorMessages[0]);
              } else if (!oneError) {
                errors.push(errorMessages[i]);
              }
            }
            break;
          case "checked":
            if (!field.is(':checked')) {
              if (oneError && errors.length < 1) {
                errors.push(errorMessages[0]);
              } else if (!oneError) {
                errors.push(errorMessages[i]);
              }
            }
            break;
          case "match":
            partner = $('input[name="' + partnerName + '"]');
            if (field.val().length > 1 && field.val() !== partner.val() && partner.val().length > 1) {
              if (oneError && errors.length < 1) {
                errors.push(errorMessages[0]);
              } else if (!oneError) {
                errors.push(errorMessages[i]);
              }
            }
            break;
          default:
            break;
        }
        i++;
      }
      if (errors.length) {
        valid = false;
        if (span.length > 0) {
          span.html(errors.join('<br>'));
        }
        parent.addClass('has-error');
      } else {
        if (!(span.length < 1)) {
          span.html('');
        }
        parent.removeClass('has-error');
      }
      if (field.attr('data-match')) {
        partner = $('input[name="' + field.attr('data-match') + '"]');
        auth.validator.validateField(partner);
      }
      return valid;
    },
    validateForm: function() {
      var field, valid, _i, _len, _ref;
      valid = true;
      _ref = this.fieldsToValidate;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        if (!this.validateField(field)) {
          valid = false;
        }
      }
      return valid;
    },
    patterns: {
      zip: /^([0-9]{5,5})$/i,
      phone: /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/i,
      email: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/i
    }
  };

}).call(this);
