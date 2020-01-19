> 🚧 This project is under developing, **API MAY CHANGED FREQUENTLY, PLEASE DON'T USE IT NOW ✋🏻**. Here's my [milestone](#milestone).

# usePlacesAutocomplete

This is a React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) of [Google Maps Places Autocomplete](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service), which helps you build an UI component with the feature of place autocomplete easily! By leverage the power of [Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places), you can provide a great UX (user experience) for user interacts with your search bar or form etc.

⚡️ Live demo: https://use-places-autocomplete.netlify.com

[![build status](https://img.shields.io/travis/wellyshen/use-places-autocomplete/master?style=flat-square)](https://travis-ci.org/wellyshen/use-places-autocomplete)
[![coverage status](https://img.shields.io/coveralls/github/wellyshen/use-places-autocomplete?style=flat-square)](https://coveralls.io/github/wellyshen/use-places-autocomplete?branch=master)
[![npm version](https://img.shields.io/npm/v/use-places-autocomplete?style=flat-square)](https://www.npmjs.com/package/use-places-autocomplete)
[![npm downloads](https://img.shields.io/npm/dm/use-places-autocomplete?style=flat-square)](https://www.npmtrends.com/use-places-autocomplete)
[![npm downloads](https://img.shields.io/npm/dt/use-places-autocomplete?style=flat-square)](https://www.npmtrends.com/use-places-autocomplete)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/use-places-autocomplete?style=flat-square)](https://bundlephobia.com/result?p=use-places-autocomplete)
[![MIT licensed](https://img.shields.io/github/license/wellyshen/use-places-autocomplete?style=flat-square)](https://raw.githubusercontent.com/wellyshen/use-places-autocomplete/master/LICENSE)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange?style=flat-square)](#contributors-)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/wellyshen/use-places-autocomplete/blob/master/CONTRIBUTING.md)
[![Twitter URL](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fwellyshen%2Fuse-places-autocomplete)](https://twitter.com/intent/tweet?text=With%20@use-places-autocomplete,%20I%20can%20build%20UI%20components%20efficiently.%20Thanks,%20@Welly%20Shen%20🤩)

## Milestone

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

## Usage Preview ([demo](https://use-places-autocomplete.netlify.com))

This is my currently idea of how does it work, **it still unstable**. So, I don't suggest you use it now. But welcome to preview or play it and feel free to give me suggestion 🤔

### Before we start

To use this hook, there're two things we need to do:

1. [Enable Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places#enable_apis).
2. [Get an API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

### Load the library

Use the `script` tag to load the library in your project.

```js
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

We also support asynchronous script loading. By doing so you need to pass the `initMap` as the [callbackName](<#parameter-(optional)>) option.

<!-- prettier-ignore-start -->
```js
<script async defer
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap"
></script>
```
<!-- prettier-ignore-end -->

> ⚠️ If you got a global function not found error. Make sure `usePlaceAutocomplete` is declared before the script is loaded.

### Create the component

Now we can start rock'n roll our component. You can check the [API](#api) section to learn more.

```js
import usePlacesAutocomplete from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';

const PlacesAutocomplete = props => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    resetSuggestions
  } = usePlacesAutocomplete({
    requestOptions: { /* Define search scope here */ }
    debounce: 300
  });
  const registerRef = useOnclickOutside(() => {
    resetSuggestions();
  });

  const handleInput = e => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }) => () => {
    setValue(description, false);
    resetSuggestions();

    // Do something you want...
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
        placeholder="Enter a place"
        type="text"
        disabled={!ready}
      />
      {value !== '' && status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
```

> 💡 [react-cool-onclickoutside](https://github.com/wellyshen/react-cool-onclickoutside) is my other hook library, which can helps you handle the interaction of user clicks outside of the component(s).

## API

```js
const return = usePlacesAutocomplete(parameter);
```

### Parameter (optional)

When use `usePlacesAutocomplete` you can configure the following options by pass an `object` as the parameter.

| Key              | Type (all optional) | Default              | Description                                                                                                                                                                                                                    |
| ---------------- | ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `requestOptions` | object              |                      | The [request options](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest.bounds) of Google Maps Places API except for `input` (e.g. bounds, radius etc.). |
| `googleMaps`     | object              | `window.google.maps` | In case you want to provide your own Google Maps object, pass it in as `google.maps`.                                                                                                                                          |
| `callbackName`   | string              |                      | You can provide a callback name to initialize `usePlacesAutocomplete` after Google script is loaded. It's useful when you [load the script asynchronously](#load-the-library).                                                 |
| `debounce`       | number              | `200`                | Number of milliseconds to delay before making a request to Google Maps Places API.                                                                                                                                             |

### Return

It's an `object` that returned with the following properties.

| Key                | Type     | Default                                    | Description                                  |
| ------------------ | -------- | ------------------------------------------ | -------------------------------------------- |
| `ready`            | boolean  | `false`                                    | The ready status of `usePlacesAutocomplete`. |
| `value`            | string   | `''`                                       | `value` for the input element.               |
| `suggestions`      | object   | `{ loading: false, status: '', data: [] }` | See [suggestions](#suggestions).             |
| `setValue`         | function | `(value, shouldFetchData = true) => {}`    | See [setValue](#setvalue).                   |
| `resetSuggestions` | function |                                            | See [resetSuggestions](#resetsuggestions).   |

#### suggestions

The search result of Google Maps Places API, which contains the following properties:

- `loading: boolean` - indicates the status of a request is pending or has completed. It's useful for displaying a loading indicator for user.
- `status: string` - indicates the status of `PlacesService` ([docs](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesServiceStatus)). It's useful to decide whether we should display the suggestions panel or not.
- `data: array` - an array of suggestion objects each contains all the data as `AutocompletePrediction` ([docs](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletePrediction)).

#### setValue

Set the `value` of the input element. Use case as below.

```js
import usePlacesAutocomplete from 'use-places-autocomplete';

const PlacesAutocomplete = props => {
  const { value, setValue } = usePlacesAutocomplete();

  const handleInput = e => {
    // Place a "string" to update the value of the input element
    setValue(e.target.value);
  };

  return (
    <div>
      <input value={value} onChange={handleInput} type="text" />
      {/* Render suggestions panel */}
    </div>
  );
};
```

In addition, the `setValue` method has an extra parameter, which can be used to disable hitting Google Maps Places API.

```js
import usePlacesAutocomplete from 'use-places-autocomplete';

const PlacesAutocomplete = props => {
  const { value, suggestions, setValue } = usePlacesAutocomplete();

  const handleSelect = description => () => {
    // When user select a place, we can update the keyword without request data from API
    // by set the second parameter to "false"
    setValue(description, false);
  };

  const renderSuggestions = () =>
    suggestions.data.map(({ id, description }) => (
      <li key={id} onClick={handleSelect(description)} role="presentation">
        {description}
      </li>
    ));

  return (
    <div>
      <input value={value} onChange={handleInput} type="text" />
      <ul>{renderSuggestions()}</ul>
    </div>
  );
};
```

#### resetSuggestions

Coming soon...

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.linkedin.com/in/welly-shen-8b43287a/"><img src="https://avatars1.githubusercontent.com/u/21308003?v=4" width="100px;" alt=""/><br /><sub><b>Welly</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=wellyshen" title="Code">💻</a> <a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=wellyshen" title="Documentation">📖</a> <a href="#maintenance-wellyshen" title="Maintenance">🚧</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
