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