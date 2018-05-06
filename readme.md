# tBox

#### What is tBox .!
tBox is a javascript plugin which converts your HTML elements to selection buttons.
tBox works on.
  - Radio elements
  - Checkbox elements
  - Single Select
  - Multiple Slecct

All you have to do is bind your elements to tBox.

### Tech
tBox is build on the open source library [jQuery]
And of course tBox itself is open source with a [public repository](tBox)
 on GitHub.

### Installation

Include the js and css files to you markup.

```sh
css/tBox.full.css
js/tBox.full.js
```

For production environments...

```sh
css/tBox.min.css
js/tBox.min.js
```
# Usage

markup
```sh
<select class="all-tBox-element" id="select-id" name="select-name" multiple>
    <option value="1000">₹1000</option>
    <option value="2000">₹2000</option>
    <option value="3000">₹3000</option>
    <option value="4000">₹4000</option>
    <option value="5000">₹5000</option>
</select>

<input class="all-tBox-element" id="checkbox-id-1" name="checkbox-name-1" type="checkbox" />
<label for="checkbox-id-1">First Checkbox</label>

<label for="checkbox-id-2">Second Checkbox</label>
<input class="all-tBox-element" id="checkbox-id-2" name="checkbox-name-2" type="checkbox" />

<input class="all-tBox-element" id="checkbox-id-3" name="checkbox-name-3" type="checkbox" data-label="Third Checkbox" />

<input class="all-tBox-element" id="radio-id-1" name="radio-name-1" type="radio" />
<label for="radio-id-1">First Radio</label>

<label for="radio-id-2">Second Radio</label>
<input class="all-tBox-element" id="radio-id-2" name="radio-name-2" type="radio" />

<input class="all-tBox-element" id="radio-id-3" name="radio-name-3" type="radio" data-label="Third Radio" />
```
javascript:
```sh
$('.all-checkboxes').tBox({ findLabel: true }); // All the elements at ones.
OR
$('#select-id').tBox(); // Select only
$('#checkbox-id-1').tBox({ findLabel: true }); // First Checkbox only
$('#checkbox-id-2').tBox({ findLabel: true }); // Second Checkbox only
$('#checkbox-id-3').tBox(); // Third Checkbox only

$('#Radio-id-1').tBox({ findLabel: true }); // First Radio only
$('#Radio-id-2').tBox({ findLabel: true }); // Second Radio only
$('#Radio-id-3').tBox(); // Third Radio only
```

More options??

Documentation [here](https://adhi92.github.io/tBox), its still under development

License
----

MIT
