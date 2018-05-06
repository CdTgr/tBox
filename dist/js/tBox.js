/* tBox main */
(function () {
    var _options = {};
    var reset_options = function () {
        return {
            size: '', // medium | large | small | full | { object with height and width in string or number }
            wrapper: '', // custom wrapper for inclusing the element
            topClass: null, // list of top level class names (array or string seperated by space)
            label: null,
            findLabel: false,
        };
    };
    this.tBox = function (elem, options, callback) {
        if (! (window.hasOwnProperty('$')) && ! (window.hasOwnProperty('jQuery'))) throw 'tBox exception : jQuery needed for tBox to work \n'+(new Error().stack);
        if (! (elem instanceof $)) throw 'tBox exception : Unsupported dom element format \n'+(new Error().stack);
        init.call(this, options, elem);
        return this;
    };
    var init = function (options, elem) {
            _options = reset_options();
            if (options instanceof Object) for (var i in options) if (_options.hasOwnProperty(i)) _options[i] = options[i]; 
            _options['element'] = elem;
            construct.call(this);
        },
        construct = function () {
            var temp_elem = _options.element,
                that = this,
                elements = [],
                error_count = 0,
                total_count = 0;
            temp_elem.each(function () {
                total_count ++;
                _options.element = $(this);
                if (_options.element.hasClass('tBox_element')) {
                    error_count ++;
                    return
                }
                var temp_container_id = tBoxEvents.generateRandomId(10, 'tBox');
                var temp_container = $('<div id="'+temp_container_id+'" class="tBox-container"></div>');
                if (this.tagName.toLowerCase() === 'select')
                {
                    var id = this.id === '' ? tBoxEvents.generateRandomId(10, 'tBox') : this.id;
                    var is_checkbox = this.multiple;
                    var elem_name = this.name === '' ? this.name : tBoxEvents.generateRandomId(10, 'tBox');
                    _options.element.find('option').each(function () {
                        temp_container.append([
                            '<input ',
                                'class="tBox_select_trigger" ',
                                'data-target="#'+id+'" ',
                                'type="'+(is_checkbox ? 'checkbox' : 'radio')+'" ',
                                'name="'+elem_name+'" ',
                                'id="'+tBoxEvents.generateRandomId(10, 'tBox')+'"',
                                'data-value="'+this.value+'" ',
                                'data-label="'+this.innerHTML+'" ',
                            ' />'
                        ].join(''));
                    });
                    delete elem_name;
                    delete is_checkbox;
                    temp_container.insertBefore(_options.element);
                    _options.element.addClass('tBox_select_reciever').addClass('tBox_element').attr('id', id);
                    temp_container = $('#'+temp_container_id)
                    temp_container.find('input').each(function () {
                        _options.element = $(this);
                        generateContainer.call(that, elements, true);
                    });
                    temp_container.append($(this).detach());
                }
                else if (this.tagName.toLowerCase() === 'input' && typeof this.type === 'string' && [ 'checkbox', 'radio' ].indexOf(this.type.toLowerCase()) !== -1) {
                    temp_container.insertBefore(_options.element);
                    temp_container = $('#'+temp_container_id);
                    temp_container.append(_options.element.detach());
                    temp_container.find('input').each(function () {
                        _options.element = $(this);
                        generateContainer.call(that, elements, true);
                    });
                    // generateContainer.call(that, elements, true);
                }
                else throw 'tBox exception : Invalid element type for tBox generation';
                tBoxEvents.generateEvents.call(that, temp_container);
            });
            _options.element = elements;
            if (error_count > 0) {
                that.destroy();
                throw 'tBox exception : One or more elemnts specified are already part of tBox, couldnot create tBox elements over tBox elements \n'+(new Error().stack);
            }
        },
        generateContainer = function (elements, remove_element) {
            var elem = _options.element.clone();
            elem.addClass('tBox_element');
            elements.push(elem);
            if (_options.wrapper == '') tBoxCustomizer.setWeapper.call(this, _options, function (wrapper) { _options.wrapper = wrapper; });
            tBoxCustomizer.setLabel.call(this, _options, function (label) { _options.wrapper.find('.tBox-label').html(label); });
            tBoxCustomizer.addTopClass.call(this, _options, function (classes) { _options.wrapper.addClass(classes); });
            if (elem.prop('checked')) { _options.wrapper.addClass('checked'); }
            else { _options.wrapper.removeClass('checked'); }
            var id = tBoxEvents.generateRandomId(10, 'tBox');
            if (typeof _options.element.attr('id') === 'string') { id = _options.element.attr('id'); }
            elem.attr('id', id);
            _options.wrapper.find('.tBox-label').attr('for', id);
            var wrapper = _options.wrapper.clone();
            wrapper.addClass('tBox-block').prepend(elem);
            wrapper.insertBefore(_options.element);
            delete wrapper;
            if (typeof remove_element === 'boolean' && remove_element === true) _options.element.remove();
        };
    this.tBox.prototype.destroy = function() {
        var group = [];
        _options.element.forEach(function (v, i) {
            if (v instanceof $) {
                if (v.hasClass('tBox_select_trigger')) {
                    if (group.indexOf(v.data('target')) === -1) {
                        group.push(v.data('target'));
                        $(v.data('target')).removeClass('tBox_element').detach().insertBefore(v.closest('.tBox-container'));
                        v.closest('.tBox-container').remove();
                    }
                }
                else {
                    v.removeClass('tBox_element');
                    var container = v.closest('.tBox-container');
                    var label = v.siblings('.tBox-label');
                    v.detach().insertBefore(container);
                    label.removeClass('tBox-label').detach().insertBefore(container);
                    container.remove();
                }
            }
        });
        if (typeof arguments[0] !== 'boolean' || arguments[0] !== true) {
            _options = reset_options();
            return null;
        }
        return this;
    };
    this.tBox.prototype.reload = function () {
        _options.element.forEach(function (v, i) { v.trigger('change'); });
        return this;
    };
})();
$(document).ready(function () {
    $.fn.extend({
        tBox: function () {
            if (arguments[0] instanceof Object) return new tBox(this, arguments[0]);
            return null;
        }
    });
});