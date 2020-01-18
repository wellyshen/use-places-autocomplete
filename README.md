# usePlacesAutocomplete

This is a React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) of [Google Maps Places Autocomplete](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service), which helps you build an UI component with the feature of place autocomplete easily! By leverage the power of [Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places), you can provide a great UX (user experience) for user interacts with your search bar or form etc.

⚡️ Live demo: https://use-places-autocomplete.netlify.com

[![build status](https://img.shields.io/travis/wellyshen/use-places-autocomplete/master?style=flat-square)](https://travis-ci.org/wellyshen/use-places-autocomplete)
[![npm version](https://img.shields.io/npm/v/use-places-autocomplete?style=flat-square)](https://www.npmjs.com/package/use-places-autocomplete)
[![npm downloads](https://img.shields.io/npm/dm/use-places-autocomplete?style=flat-square)](https://www.npmtrends.com/use-places-autocomplete)
[![npm downloads](https://img.shields.io/npm/dt/use-places-autocomplete?style=flat-square)](https://www.npmtrends.com/use-places-autocomplete)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-places-autocomplete?style=flat-square)](https://bundlephobia.com/result?p=use-places-autocomplete)
[![MIT licensed](https://img.shields.io/github/license/wellyshen/use-places-autocomplete?style=flat-square)](https://raw.githubusercontent.com/wellyshen/use-places-autocomplete/master/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/wellyshen/use-places-autocomplete/blob/master/CONTRIBUTING.md)

🚧 This package is under developing. **API CHANGED FREQUENTLY, PLEASE DON'T USE IT NOW ✋🏻**. The milestone as below:

- [x] usePlacesAutocomplete hook
- [ ] Useful utils, e.g. geocoding etc.
- [ ] Server-side rendering friendly
- [ ] Built-in autocomplete UI component (maybe...)
- [ ] Unit testing
- [x] Demo app
- [ ] Documentation
- [ ] Typescript type definition
- [x] CI/CD

## Requirement

To use `use-places-autocomplete`, you must use `react@16.8.0` or greater which includes hooks.

## Installation

This package is distributed via [npm](https://www.npmjs.com/package/use-places-autocomplete).

```sh
$ yarn add use-places-autocomplete
# or
$ npm install --save use-places-autocomplete
```

## Preview Usage ([demo](https://use-places-autocomplete.netlify.com))

This is my currently idea of how it works, it still unstable. So, I don't suggest you use it at this moment. But you can preview or play it and feel free to give me suggestion 🤔

Load the Google Maps Places library in your project.

```js
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

Then create your component.

```js
import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

const PlacesAutocomplete = () => {
  const [focused, setFocused] = useState(false);
  const {
    // The initial status of Google Maps Places API
    ready,
    value,
    // The "status" as here: https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesServiceStatus
    // The "data" as here: https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletePrediction
    suggestions: { status, data },
    setValue,
    // Clear the suggestions.data
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      // Options of Places Autocomplete API: https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest
    }
    debounce: 200
  });
  const registerRef = useOnclickOutside(() => {
    setFocused(false);
    // To prevent the last suggestions show up when the input field is focused
    clearSuggestions();
  });

  const handleFocus = () => {
    setFocused(true);
  };

  const handleInput = e => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    // Set the second parameter as "true" means updating value without requesting suggestions
    // It's useful to update the search keyword only for user
    setValue(description, true);
    // To prevent the last suggestions show up when the input field is focused
    clearSuggestions();
  };

  const renderSuggestions = () =>
    data.map(suggestion => (
      <li
        key={suggestion.id}
        onClick={handleSelect(suggestion)}
        role="presentation"
      >
        {suggestion.description}
      </li>
    ));

  return (
    <div ref={registerRef}>
      <input
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        placeholder="Enter a place"
        type="text"
        disabled={!ready}
      />
      {focused && data.length !== 0 && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
```

> 💡 You can use [react-cool-onclickoutside](https://github.com/wellyshen/react-cool-onclickoutside) to handle the interaction of user clicks outside of your component.
