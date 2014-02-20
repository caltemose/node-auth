// Generated by CoffeeScript 1.6.3
(function() {
  var Field,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Field = (function() {
    function Field(house) {
      var _ref, _ref1;
      this.house = house;
      this.check_value = __bind(this.check_value, this);
      this.blur = __bind(this.blur, this);
      this.focus = __bind(this.focus, this);
      this.input = $('input,select', this.house);
      this.field_update_event = "keyup";
      if (((_ref = this.input[0]) != null ? _ref.type : void 0) === "checkbox" || ((_ref1 = this.input[0]) != null ? _ref1.type : void 0) === "radio") {
        this.field_update_event = "change";
      }
      this.input.bind(this.field_update_event, this.check_value).focus(this.focus).blur(this.blur);
      this.extract_configuration();
      this.house.add(this.input).data("field", this);
    }

    Field.prototype.focus = function() {
      return this.house.addClass("focus");
    };

    Field.prototype.blur = function(event) {
      var _ref;
      if ((_ref = auth.selections.body) != null) {
        _ref.trigger("field_edited");
      }
      return this.house.removeClass("focus");
    };

    Field.prototype.extract_configuration = function() {
      var d;
      d = this.house.data();
      this.validation_method = d.validate || false;
      this.error_message = d.errorMessage || false;
      this.requires_validation = this.validation_method || this.house.is('.required');
      return this.error_flag = new ErrorFlag(this);
    };

    Field.prototype.check_value = function(event) {
      var event_type, _ref;
      event_type = event != null ? event.type : void 0;
      if (this.requires_validation) {
        if (this.is_valid()) {
          this.accept_value();
        } else {
          this.reject_value(!event || event_type === "blur");
        }
      }
      return (_ref = auth.selections.body) != null ? _ref.trigger("field_edited") : void 0;
    };

    Field.prototype.is_valid = function() {
      return this.valid = auth.validator.test(this.validation_method, this.input);
    };

    Field.prototype.accept_value = function() {
      if (this.required == null) {
        this.required = this.house.is(".required");
      }
      this.house.removeClass('field-with-errors');
      if (this.required || this.valid && this.input.val().length) {
        this.house.addClass('completed');
      } else {
        this.house.removeClass('completed');
      }
      this.error_flag.conceal();
      return this.house.trigger("value_accepted");
    };

    Field.prototype.reject_value = function(apply_error_state) {
      this.house.addClass(apply_error_state ? 'field-with-errors' : null).removeClass('completed');
      if (apply_error_state) {
        this.error_flag.reveal();
      }
      return this.house.trigger("value_rejected");
    };

    Field.prototype.report_errors = function() {
      if (this.valid || !this.requires_validation) {
        return null;
      } else {
        return this.error_message || "invalid field";
      }
    };

    Field.prototype.reset = function() {
      this.input.not('input:radio, input:checkbox').val('').blur();
      if (this.mask) {
        this.mask.reset();
      }
      this.house.removeClass('completed field-with-errors');
      return this.error_flag.conceal();
    };

    return Field;

  })();

}).call(this);
