import {SUPPORTS_VALIDITY_API} from './consts';
import {hashKey} from './utils';

export default function(Selectize) {
  $.fn.selectize = function(settingsUser) {
      var defaults             = $.fn.selectize.defaults;
      var settings             = $.extend({}, defaults, settingsUser);
      var attrData            = settings.dataAttr;
      var fieldLabel          = settings.labelField;
      var fieldValue          = settings.valueField;
      var fieldOptgroup       = settings.optgroupField;
      var fieldOptgroupLabel = settings.optgroupLabelField;
      var fieldOptgroupValue = settings.optgroupValueField;

      /**
       * Initializes selectize from a <input type="text"> element.
       *
       * @param {object} $input
       * @param {object} settingsElement
       */
      var initTextbox = function($input, settingsElement) {
          var i, n, values, option;

          var dataRaw = $input.attr(attrData);

          if (!dataRaw) {
              var value = $.trim($input.val() || '');
              if (!settings.allowEmptyOption && !value.length) return;
              values = value.split(settings.delimiter);
              for (i = 0, n = values.length; i < n; i++) {
                  option = {};
                  option[fieldLabel] = values[i];
                  option[fieldValue] = values[i];
                  settingsElement.options.push(option);
              }
              settingsElement.items = values;
          } else {
              settingsElement.options = JSON.parse(dataRaw);
              for (i = 0, n = settingsElement.options.length; i < n; i++) {
                  settingsElement.items.push(settingsElement.options[i][fieldValue]);
              }
          }
      };

      /**
       * Initializes selectize from a <select> element.
       *
       * @param {object} $input
       * @param {object} settingsElement
       */
      var initSelect = function($input, settingsElement) {
          var i, n, tagName, $children;
          var options = settingsElement.options;
          var optionsMap = {};

          var readData = function($el) {
              var data = attrData && $el.attr(attrData);
              if (typeof data === 'string' && data.length) {
                  return JSON.parse(data);
              }
              return null;
          };

          var addOption = function($option, group) {
              $option = $($option);

              var value = hashKey($option.val());
              if (!value && !settings.allowEmptyOption) return;

              // if the option already exists, it's probably been
              // duplicated in another optgroup. in this case, push
              // the current group to the "optgroup" property on the
              // existing option so that it's rendered in both places.
              if (optionsMap.hasOwnProperty(value)) {
                  if (group) {
                      var arr = optionsMap[value][fieldOptgroup];
                      if (!arr) {
                          optionsMap[value][fieldOptgroup] = group;
                      } else if (!$.isArray(arr)) {
                          optionsMap[value][fieldOptgroup] = [arr, group];
                      } else {
                          arr.push(group);
                      }
                  }
                  return;
              }

              var option             = readData($option) || {};
              option[fieldLabel]    = option[fieldLabel] || $option.text();
              option[fieldValue]    = option[fieldValue] || value;
              option[fieldOptgroup] = option[fieldOptgroup] || group;

              optionsMap[value] = option;
              options.push(option);

              if ($option.is(':selected')) {
                  settingsElement.items.push(value);
              }
          };

          var addGroup = function($optgroup) {
              var i, n, id, optgroup, $options;

              $optgroup = $($optgroup);
              id = $optgroup.attr('label');

              if (id) {
                  optgroup = readData($optgroup) || {};
                  optgroup[fieldOptgroupLabel] = id;
                  optgroup[fieldOptgroupValue] = id;
                  settingsElement.optgroups.push(optgroup);
              }

              $options = $('option', $optgroup);
              for (i = 0, n = $options.length; i < n; i++) {
                  addOption($options[i], id);
              }
          };

          settingsElement.maxItems = $input.attr('multiple') ? null : 1;

          $children = $input.children();
          for (i = 0, n = $children.length; i < n; i++) {
              tagName = $children[i].tagName.toLowerCase();
              if (tagName === 'optgroup') {
                  addGroup($children[i]);
              } else if (tagName === 'option') {
                  addOption($children[i]);
              }
          }
      };

      return this.each(function() {
          if (this.selectize) return;

          var instance;
          var $input = $(this);
          var tagName = this.tagName.toLowerCase();
          var placeholder = $input.attr('placeholder') || $input.attr('data-placeholder');
          if (!placeholder && !settings.allowEmptyOption) {
              placeholder = $input.children('option[value=""]').text();
          }

          var settingsElement = {
              'placeholder' : placeholder,
              'options'     : [],
              'optgroups'   : [],
              'items'       : []
          };

          if (tagName === 'select') {
              initSelect($input, settingsElement);
          } else {
              initTextbox($input, settingsElement);
          }

          instance = new Selectize($input, $.extend(true, {}, defaults, settingsElement, settingsUser));
      });
  };

  $.fn.selectize.defaults = Selectize.defaults;
  $.fn.selectize.support = {
      validity: SUPPORTS_VALIDITY_API
  };
}
