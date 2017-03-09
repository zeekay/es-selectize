import Selectize from './selectize';
import defaults  from './defaults'
import {hashKey} from './utils';


export default function selectize(optsUser) {
    var opts               = $.extend({}, defaults, optsUser);
    var attrData           = opts.dataAttr;
    var fieldLabel         = opts.labelField;
    var fieldValue         = opts.valueField;
    var fieldOptgroup      = opts.optgroupField;
    var fieldOptgroupLabel = opts.optgroupLabelField;
    var fieldOptgroupValue = opts.optgroupValueField;

    /**
     * Initializes selectize from a <input type="text"> element.
     *
     * @param {object} $input
     * @param {object} optsElement
     */
    var initTextbox = function($input, optsElement) {
        var i, n, values, option;

        var dataRaw = $input.attr(attrData);

        if (!dataRaw) {
            var value = $.trim($input.val() || '');
            if (!opts.allowEmptyOption && !value.length) return;
            values = value.split(opts.delimiter);
            for (i = 0, n = values.length; i < n; i++) {
                option = {};
                option[fieldLabel] = values[i];
                option[fieldValue] = values[i];
                optsElement.options.push(option);
            }
            optsElement.items = values;
        } else {
            optsElement.options = JSON.parse(dataRaw);
            for (i = 0, n = optsElement.options.length; i < n; i++) {
                optsElement.items.push(optsElement.options[i][fieldValue]);
            }
        }
    };

    /**
     * Initializes selectize from a <select> element.
     *
     * @param {object} $input
     * @param {object} optsElement
     */
    var initSelect = function($input, optsElement) {
        var i, n, tagName, $children;
        var options = optsElement.options;
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
            if (!value && !opts.allowEmptyOption) return;

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

            var option            = readData($option) || {};
            option[fieldLabel]    = option[fieldLabel] || $option.text();
            option[fieldValue]    = option[fieldValue] || value;
            option[fieldOptgroup] = option[fieldOptgroup] || group;

            optionsMap[value] = option;
            options.push(option);

            if ($option.is(':selected')) {
                optsElement.items.push(value);
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
                optsElement.optgroups.push(optgroup);
            }

            $options = $('option', $optgroup);
            for (i = 0, n = $options.length; i < n; i++) {
                addOption($options[i], id);
            }
        };

        optsElement.maxItems = $input.attr('multiple') ? null : 1;

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
        if (!placeholder && !opts.allowEmptyOption) {
            placeholder = $input.children('option[value=""]').text();
        }

        var optsElement = {
            'placeholder' : placeholder,
            'options'     : [],
            'optgroups'   : [],
            'items'       : []
        };

        if (tagName === 'select') {
            initSelect($input, optsElement);
        } else {
            initTextbox($input, optsElement);
        }

        instance = new Selectize($input, $.extend(true, {}, defaults, optsElement, optsUser));
    });
}
