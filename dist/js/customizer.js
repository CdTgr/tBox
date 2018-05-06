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