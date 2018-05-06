/* events section */
(function () {
    var ev = (function () {
        var checkbox_change = function (evnt) {
            var me = $(this);
            if (this.checked) {
                me.closest('.tBox-block').addClass('checked');
                if (this.type == 'radio' && this.name != '') {
                    var that = this;
                    $('input[type="radio"][name="'+this.name+'"]').each(function () {
                        if (this != that) $(this).closest('.tBox-block').removeClass('checked');
                    });
                }
            }
            else me.closest('.tBox-block').removeClass('checked');
            if (me.hasClass('tBox_select_trigger')) {
                if (typeof me.attr('data-target') === 'string' && typeof me.attr('data-value') === 'string') {
                    var select = $(me.attr('data-target'));
                    if (select.length <= 0) return;
                    if (select.prop('multiple') === true) {
                        var val = select.val();
                        if (this.checked) {
                            val.push(me.attr('data-value'));
                        }
                        else if (val.indexOf(me.attr('data-value')) !== -1) {
                            val.splice(val.indexOf(me.attr('data-value')), 1);
                        }
                        select.val(val);
                        delete val;
                    }
                    else {
                        if (this.checked) select.val(me.attr('data-value'));
                        else select.val('');
                    }
                    delete select;
                }
            }
            else {} // normal
            delete me;
        };
        return {
            checkboxChange: checkbox_change
        };
    })();
    var getRandomId = function (length, prefix) {
            length = typeof length !== 'number' ? 10 : length;
            var text = '',
                possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var i = null;
            for(i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));
            delete i;
            delete possible;
            return (typeof prefix === 'string' && prefix.trim() != '' ? (prefix + '_') : '') + text;
        },
        generate_events = function (element) {
            if (! window.hasOwnProperty('$') || ! (element instanceof $)) throw 'tBox exception : Couldnot initialize tBox events \n'+(new Error().stack);
            element.on('change', 'input[type="checkbox"], input[type="radio"]', ev.checkboxChange);
        };
    this.tBoxEvents = (function () {
        return {
            generateRandomId: getRandomId,
            generateEvents: generate_events
        };
    })();
})();


/* customization section */
(function () {
    var wrapper = '',
        is_unit = function (item) {
            var allowed_units = [ 'px', 'pt', '%', 'in', 'ft', 'rem', 'em', 'vmin', 'vmax', 'vh', 'vw' ];
            if (typeof item === 'string') {
                for (var i in allowed_units)
                    if (item.toLowerCase().indexOf(allowed_units[i]) === item.length - allowed_units[i].length)
                        if (! isNaN(parseInt(item.toLowerCase().replace(allowed_units[i], ''), 10))) return item.toLowerCase();
                if (! isNaN(parseInt(item, 10))) return item + 'px';
            }
            if (typeof item === 'number') return item + 'px';
            return null;
        },
        make_unit = function (item) {
            if (! (item instanceof Object) || ! (item.hasOwnProperty('height')) || ! (item.hasOwnProperty('width'))) return null;
            var _item = {
                height: is_unit(item.height),
                width: is_unit(item.width)
            };
            return _item.height !== null && _item.width !== null ? _item : null;
        },
        get_default_wrapper = function () {
            return [
                '<div class="tBox-block">',
                    '<label class="tBox-label">',
                    '</label>',
                '</div>'
            ].join('');
        },
        _set_size = function (size) {
            if (typeof size === 'string') {
                var supported_size = [ 'small', 'medium', 'large' , 'full'];
                size = size.toString().trim().toLowerCase();
                if (supported_size.indexOf(size) !== -1) return wrapper.addClass(size);
            }
            else if (size instanceof Object) {
                size = make_unit.call(this, size);
                if (size instanceof Object) return wrapper.css(size).find('.tBox-label').css(size);
            }
            return wrapper.addClass('medium');
        },
        _set_wrapper = function (options, callback) {
            wrapper = typeof options['wrapper'] === 'string' ? options.wrapper : '';
            wrapper = $(wrapper.trim() != '' ? wrapper : get_default_wrapper.call(this));
            _set_size.call(this, typeof options['size'] === 'string' || options['size'] instanceof Object ? options.size : 'medium');
            return callback instanceof Function ? callback(wrapper) : null;
        },
        _set_label = function (options, callback) {
            if (! (callback instanceof Function)) return null;
            if (! (options instanceof Object) && ! (options['element'] instanceof $)) return callback('');
            var label = '';
            if (typeof options['label'] === 'string') return callback(options.label);
            if (typeof options['findLabel'] === 'boolean' && options.findLabel === true) {
                var found = false;
                label = options.element.attr('id');
                if (typeof label === "string" && label.trim() != '') {
                    found = $('label[for="'+label+'"]');
                    label = found.length > 0 ? found.html() : '';
                    found.remove();
                    found = true;
                }
                else label = '';
                // if (! found) {
                //     label = options.element.closest('label');
                //     label = label.length > 0 ? label.html() : '';
                // }
                if (typeof options.element.attr('data-label') === 'string' && options.element.attr('data-label').trim() != '') label = options.element.attr('data-label');
            }
            else if (typeof options.element.attr('data-label') === 'string' && options.element.attr('data-label').trim() != '') label = options.element.attr('data-label');
            return callback(label);
        },
        _get_top_class_names = function (options, callback) {
            if (! (callback instanceof Function)) return null;
            if (! (options instanceof Object)) return callback('');
            var classNames = [];
            if (typeof options['topClass'] === 'string') options.topClass = options.topClass.trim().split(' ');
            if (options['topClass'] instanceof Array) classNames = options.topClass.map(function (a) { return typeof a === 'string' ? a.trim() : ''; }).filter(function (a) { return a != ''; });
            return callback(classNames.join(' '));
        };
    this.tBoxCustomizer = (function () {
        return {
            setWeapper: _set_wrapper,
            setLabel: _set_label,
            addTopClass:_get_top_class_names
        };
    })();
})();



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
                    var elem_name = typeof this.name === 'string' && this.name != '' ? this.name : tBoxEvents.generateRandomId(10, 'tBox');
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
            else return new tBox(this, {});
        }
    });
});