# <em><b>USE-PLACES-AUTOCOMPLETE</b></em>

This is a React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook) for [Google Maps Places Autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete), which helps you build a UI component with the feature of place autocomplete easily! By leveraging the power of [Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places), you can provide a great UX (user experience) for user interacts with your search bar or form etc. Hope you guys 👍🏻 it.

❤️ it? ⭐️ it on [GitHub](https://github.com/wellyshen/use-places-autocomplete/stargazers) or [Tweet](https://twitter.com/intent/tweet?text=With%20@use-places-autocomplete,%20I%20can%20build%20a%20component%20with%20the%20feature%20of%20place%20autocomplete%20easily!%20Thanks,%20@Welly%20Shen%20🤩) about it.

[![build status](https://img.shields.io/github/workflow/status/wellyshen/use-places-autocomplete/CI?style=flat-square)](https://github.com/wellyshen/use-places-autocomplete/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/coveralls/github/wellyshen/use-places-autocomplete?style=flat-square)](https://coveralls.io/github/wellyshen/use-places-autocomplete?branch=master)
[![npm version](https://img.shields.io/npm/v/use-places-autocomplete?style=flat-square)](https://www.npmjs.com/package/use-places-autocomplete)
[![npm downloads](https://img.shields.io/npm/dm/use-places-autocomplete?style=flat-square)](https://www.npmtrends.com/use-places-autocomplete)
[![npm downloads](https://img.shields.io/npm/dt/use-places-autocomplete?style=flat-square)](https://www.npmtrends.com/use-places-autocomplete)
[![gzip size](https://badgen.net/bundlephobia/minzip/use-places-autocomplete?label=gzip%20size&style=flat-square)](https://bundlephobia.com/result?p=use-places-autocomplete)
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Twitter URL](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2Fwellyshen%2Fuse-places-autocomplete)](https://twitter.com/intent/tweet?text=With%20@use-places-autocomplete,%20I%20can%20build%20a%20component%20with%20the%20feature%20of%20place%20autocomplete%20easily!%20Thanks,%20@Welly%20Shen%20🤩)

## Live Demo

![demo](https://user-images.githubusercontent.com/21308003/91069764-6133e680-e668-11ea-8a57-bfbea2cfbd29.gif)

⚡️ Try yourself: https://use-places-autocomplete.netlify.app

## Features

- 🧠 Provides intelligent places suggestions powered by [Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places).
- 🎣 Builds your own customized autocomplete UI by React [hook](https://reactjs.org/docs/hooks-custom.html#using-a-custom-hook).
- 🔧 [Utility functions](#utility-functions) to do geocoding and get geographic coordinates using [Google Maps Geocoding API](https://developers.google.com/maps/documentation/javascript/geocoding).
- 🤑 Built-in [cache mechanism](#cache-data-for-you) for you to save the cost of Google APIs.
- 💰 Built-in debounce mechanism for you to lower the cost of Google APIs.
- 🚀 Supports asynchronous Google script loading.
- 📜 Supports [TypeScript](https://www.typescriptlang.org) type definition.
- ⌨️ Builds a UX-rich component (e.g. [WAI-ARIA compliant](https://rawgit.com/w3c/aria-practices/master/aria-practices-DeletedSectionsArchive.html#autocomplete) and keyword support) via comprehensive [demo code](app/src/App/index.tsx).
- 🦔 Tiny size ([~ 1.7KB gzipped](https://bundlephobia.com/result?p=use-places-autocomplete)). No external dependencies, aside for the `react`.

## Requirement

To use `use-places-autocomplete`, you must use `react@16.8.0` or greater which includes hooks.

## Installation

This package is distributed via [npm](https://www.npmjs.com/package/use-places-autocomplete).

```sh
$ yarn add use-places-autocomplete
# or
$ npm install --save use-places-autocomplete
```

When working with TypeScript you need to install the [@types/google.maps](https://www.npmjs.com/package/@types/google.maps) as a `devDependencies`.

```sh
$ yarn add --dev @types/google.maps
# or
$ npm install --save-dev @types/google.maps
```

## Getting Started

`usePlacesAutocomplete` is based on the [Places Autocomplete](https://developers.google.com/maps/documentation/javascript/places-autocomplete) (or more specific [docs](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service)) of [Google Maps Place API](https://developers.google.com/maps/documentation/javascript/places). If you are unfamiliar with these APIs, we recommend you reviewing them before we start.

### Setup APIs

To use this hook, there're two things we need to do:

1. [Enable Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places#enable_apis).
2. [Get an API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

### Load the library

Use the `script` tag to load the library in your project.

```js
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
```

We also support asynchronous script loading. By doing so you need to pass the `initMap` to the [callbackName](#parameter-optional) option.

<!-- prettier-ignore-start -->
```js
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places&callback=initMap"></script>
```
<!-- prettier-ignore-end -->

> ⚠️ If you got a global function not found error. Make sure `usePlaceAutocomplete` is declared before the script was loaded.

### Create the component

Now we can start to build our component. Check the [API](#api) out to learn more.

```js
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

const PlacesAutocomplete = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
```

> 💡 [react-cool-onclickoutside](https://github.com/wellyshen/react-cool-onclickoutside) is my other hook library, which can help you handle the interaction of user clicks outside of the component(s).

Easy right? This is the magic of the `usePlacesAutocomplete` ✨. I just show you how does it work via the minimal example. However you can build a UX rich autocomplete component, like [WAI-ARIA compliant](https://rawgit.com/w3c/aria-practices/master/aria-practices-DeletedSectionsArchive.html#autocomplete) and keyword interaction as my [demo](#live-demo) by checking the [code](app/src/App/index.tsx) or integrate this hook with the [combobox](https://reacttraining.com/reach-ui/combobox) of [Reach UI](https://reacttraining.com/reach-ui) to achieve that.

[![Edit usePlacesAutocomplete x Reach UI](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/useplacesautocomplete-x-reach-ui-lik2c?fontsize=14&hidenavigation=1&theme=dark)

```js
import usePlacesAutocomplete from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";

const PlacesAutocomplete = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
  } = usePlacesAutocomplete();

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = (val) => {
    setValue(val, false);
  };

  return (
    <Combobox onSelect={handleSelect} aria-labelledby="demo">
      <ComboboxInput value={value} onChange={handleInput} disabled={!ready} />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
```

## Lazily Initializing The Hook

When loading the Google Maps Places API via a 3rd-party library, you may need to wait for the script ready before using this hook. However, you can lazily initialize the hook by the following ways depends on your case.

Option 1, manually initializing the hook:

```js
import usePlacesAutocomplete from "use-places-autocomplete";

const App = () => {
  const { init } = usePlacesAutocomplete({
    initOnMount: false, // Disable initializing when the component mounts, default is true
  });

  const [loading] = useGoogleMapsApi({
    library: "places",
    onLoad: () => init(), // Lazily initializing the hook when the script is ready
  });

  return <div>{/* Some components... */}</div>;
};
```

Option 2, wrap the hook into the conditional component:

```js
import usePlacesAutocomplete from "use-places-autocomplete";

const PlacesAutocomplete = () => {
  const { ready, value, suggestions, setValue } = usePlacesAutocomplete();

  return <div>{/* Some components... */}</div>;
};

const App = () => {
  const [loading] = useGoogleMapsApi({ library: "places" });

  return (
    <div>
      {!loading ? <PlacesAutocomplete /> : null}
      {/* Other components... */}
    </div>
  );
};
```

## Cache Data For You

By default, this library caches the response data to help you saving the [cost of Google Maps Places API](https://developers.google.com/maps/billing/gmp-billing#ac-per-request) and optimize the search performance as well.

```js
const methods = usePlacesAutocomplete({
  // Provide the cache time in seconds, default is 24 hours
  cache: 24 * 60 * 60,
});
```

> By the way, the cached data is stored via the [Window.sessionStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).

### Custom cache key

You may need to have multiple caches, for example if you use different [place type restrictions](https://developers.google.com/maps/documentation/places/web-service/supported_types#table3_) for different pickers in your app.

```js
const methods = usePlacesAutocomplete({
  // Provide a custom cache key
  cacheKey: "region-restricted",
});
```

> Note that usePlacesAutocomplete will prefix this with `upa-`, so the above would become `upa-region-restricted` in sessionStorage.

## API

```js
const returnObj = usePlacesAutocomplete(parameterObj);
```

### Parameter object (optional)

When use `usePlacesAutocomplete` you can configure the following options via the parameter.

| Key              | Type            | Default              | Description                                                                                                                                                                                                             |
| ---------------- | --------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `requestOptions` | object          |                      | The [request options](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest) of Google Maps Places API except for `input` (e.g. bounds, radius etc.). |
| `googleMaps`     | object          | `window.google.maps` | In case you want to provide your own Google Maps object, pass the `google.maps` to it.                                                                                                                                  |
| `callbackName`   | string          |                      | You can provide a callback name to initialize `usePlacesAutocomplete` after Google script is loaded. It's useful when you [load the script asynchronously](#load-the-library).                                          |
| `debounce`       | number          | `200`                | Number of milliseconds to delay before making a request to Google Maps Places API.                                                                                                                                      |
| `cache`          | number \| false | `86400` (24 hours)   | Number of seconds to [cache the response data of Google Maps Places API](#cache-data-for-you).                                                                                                                          |
| `cacheKey`       | string          | `"upa"`              | Optional cache key so one can use multiple caches if needed.                                                                                                                                                            |
| `defaultValue`   | string          | `""`                 | Default value for the `input` element.                                                                                                                                                                                  |
| `initOnMount`    | boolean         | `true`               | Initialize the hook with Google Maps Places API when the component mounts.                                                                                                                                              |

### Return object

It's returned with the following properties.

| Key                | Type     | Default                                    | Description                                                                |
| ------------------ | -------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `ready`            | boolean  | `false`                                    | The ready status of `usePlacesAutocomplete`.                               |
| `value`            | string   | `""`                                       | `value` for the input element.                                             |
| `suggestions`      | object   | `{ loading: false, status: "", data: [] }` | See [suggestions](#suggestions).                                           |
| `setValue`         | function | `(value, shouldFetchData = true) => {}`    | See [setValue](#setvalue).                                                 |
| `clearSuggestions` | function |                                            | See [clearSuggestions](#clearsuggestions).                                 |
| `clearCache`       | function | `(key = cacheKey) => {}`                   | Clears the [cached data](#cache-data-for-you).                             |
| `init`             | function |                                            | Useful when [lazily initializing the hook](#lazily-initializing-the-hook). |

#### suggestions

The search result of Google Maps Places API, which contains the following properties:

- `loading: boolean` - indicates the status of a request is pending or has completed. It's useful for displaying a loading indicator for user.
- `status: string` - indicates the status of API response, which has these [values](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlacesServiceStatus). It's useful to decide whether we should display the dropdown or not.
- `data: array` - an array of suggestion objects each contains all the [data](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletePrediction).

#### setValue

Set the `value` of the input element. Use case as below.

```js
import usePlacesAutocomplete from "use-places-autocomplete";

const PlacesAutocomplete = () => {
  const { value, setValue } = usePlacesAutocomplete();

  const handleInput = (e) => {
    // Place a "string" to update the value of the input element
    setValue(e.target.value);
  };

  return (
    <div>
      <input value={value} onChange={handleInput} />
      {/* Render dropdown */}
    </div>
  );
};
```

In addition, the `setValue` method has an extra parameter, which can be used to disable hitting Google Maps Places API.

```js
import usePlacesAutocomplete from "use-places-autocomplete";

const PlacesAutocomplete = () => {
  const {
    value,
    suggestions: { status, data },
    setValue
  } = usePlacesAutocomplete();

  const handleSelect = ({ description }) => () => {
    // When user select a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(description, false);
  };

  const renderSuggestions = () =>
    data.map(suggestion => (
        <li
          key={suggestion.place_id}
          onClick={handleSelect(suggestion)}
        >
          {/* Render suggestion text */}
        </li>
      )
    });

  return (
    <div>
      <input value={value} onChange={handleInput} />
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
```

#### clearSuggestions

Calling the method will clear and reset all the properties of the `suggestions` object to default. It's useful for dismissing the dropdown.

```js
import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

const PlacesAutocomplete = () => {
  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete();
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, call it to clear and reset the suggestions data
    clearSuggestions()
  });

  const renderSuggestions = () =>
    data.map(suggestion => (
        <li
          key={suggestion.place_id}
          onClick={handleSelect(suggestion)}
        >
          {/* Render suggestion text */}
        </li>
      )
    });

  return (
    <div ref={ref}>
      <input value={value} onChange={handleInput} />
      {/* After calling the clearSuggestions(), the "status" is reset so the dropdown is hidden */}
      {status === 'OK' && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};
```

## Utility Functions

We provide [getGeocode](#getgeocode), [getLatLng](#getlatlng), [getZipCode](#getzipcode) and [getDetails](#getdetails) utils for you to do geocoding and get geographic coordinates when needed.

### getGeocode

It helps you convert address (e.g. "Section 5, Xinyi Road, Xinyi District, Taipei City, Taiwan") into geographic coordinates (e.g. latitude 25.033976 and longitude 121.5645389) or restrict the results to a specific area by [Google Maps Geocoding API](https://developers.google.com/maps/documentation/javascript/geocoding).

In case you want to restrict the results to a specific area you will have to pass the `address` and the `componentRestrictions` matching the [GeocoderComponentRestrictions interface](https://developers.google.com/maps/documentation/javascript/reference/geocoder#GeocoderComponentRestrictions).

```js
import { getGeocode } from "use-places-autocomplete";

const parameter = {
  address: "Section 5, Xinyi Road, Xinyi District, Taipei City, Taiwan",
  // or
  placeId: "ChIJraeA2rarQjQRPBBjyR3RxKw",
};

getGeocode(parameter)
  .then((results) => {
    console.log("Geocoding results: ", results);
  })
  .catch((error) => {
    console.log("Error: ", error);
  });
```

`getGeocode` is an asynchronous function with the following API:

- `parameter: object` - you must supply one, only one of `address` or `location` or `placeId` and optionally `bounds`, `componentRestrictions`, `region`. It'll be passed as [Geocoding Requests](https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingRequests).
- `results: array` - an array of objects each contains all the [data](https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingResults).
- `error: string` - the error status of API response, which has these [values](https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingStatusCodes) (except for "OK").

### getLatLng

It helps you get the `lat` and `lng` from the result object of `getGeocode`.

```js
import { getGeocode, getLatLng } from "use-places-autocomplete";

const parameter = {
  address: "Section 5, Xinyi Road, Xinyi District, Taipei City, Taiwan",
};

getGeocode(parameter).then((results) => {
  const { lat, lng } = getLatLng(results[0]);
  console.log("Coordinates: ", { lat, lng });
});
```

`getLatLng` is a function with the following API:

- `parameter: object` - the result object of `getGeocode`.
- `latLng: object` - contains the latitude and longitude properties.
- `error: any` - an exception.

### getZipCode

It helps you get the `postal_code` from the result object of `getGeocode`.

```js
import { getGeocode, getZipCode } from "use-places-autocomplete";

const parameter = {
  address: "Section 5, Xinyi Road, Xinyi District, Taipei City, Taiwan",
};

getGeocode(parameter)
  // By default we use the "long_name" value from API response, you can tell the utility to use "short_name"
  // by setting the second parameter to "true"
  .then((results) => {
    const zipCode = getZipCode(results[0], false);
    console.log("ZIP Code: ", zipCode);
  });
```

`getZipCode` is a function with the following API:

- `parameters` - there're two parameters:
  - `1st: object` - the result object of `getGeocode`.
  - `2nd: boolean` - should use the `short_name` or not from [API response](https://developers.google.com/places/web-service/details#PlaceDetailsResponses), default is `false`.
- `zipCode: string | null` - the zip code. If the address doesn't have zip code it will be `null`.
- `error: any` - an exception.

### getDetails

Retrieves a great deal of information about a particular place ID (`suggestion`).

```js
import usePlacesAutocomplete, { getDetails } from "use-places-autocomplete";

const PlacesAutocomplete = () => {
  const { suggestions, value, setValue } = usePlacesAutocomplete();

  const handleInput = (e) => {
    // Place a "string" to update the value of the input element
    setValue(e.target.value);
  };

  const submit = () => {
    const parameter = {
      // Use the "place_id" of suggestion from the dropdown (object), here just taking first suggestion for brevity
      placeId: suggestions[0].place_id,
      // Specify the return data that you want (optional)
      fields: ["name", "rating"],
    };

    getDetails(parameter)
      .then((details) => {
        console.log("Details: ", details);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  };

  return (
    <div>
      <input value={value} onChange={handleInput} />
      {/* Render dropdown */}
      <button onClick={submit}>Submit Suggestion</button>
    </div>
  );
};
```

`getDetails` is an asynchronous function with the following API:

- `parameter: object` - [the request](https://developers.google.com/maps/documentation/javascript/places#place_details_requests) of the PlacesService's `getDetails()` method. You must supply the `placeId` that you would like details about. If you do not specify any fields or omit the fields parameter you will get every field available.
- `placeResult: object | null` - [the details](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult) about the specific place your queried.
- `error: any` - an exception.

> ⚠️ warning, you are billed based on how much information you retrieve, So it is advised that you retrieve just what you.

## Articles / Blog Posts

> 💡 If you have written any blog post or article about `use-places-autocomplete`, please open a PR to add it here.

- Featured on [React Status #175](https://react.statuscode.com/issues/175).
- Featured on [React Newsletter #199](https://reactnewsletter.com/issues/199).

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://wellyshen.com"><img src="https://avatars1.githubusercontent.com/u/21308003?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Welly</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=wellyshen" title="Code">💻</a> <a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=wellyshen" title="Documentation">📖</a> <a href="#maintenance-wellyshen" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://kylekirkby.github.io"><img src="https://avatars0.githubusercontent.com/u/4564433?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kyle</b></sub></a><br /><a href="#translation-kylekirkby" title="Translation">🌍</a></td>
    <td align="center"><a href="https://www.lkaric.tech"><img src="https://avatars0.githubusercontent.com/u/16634314?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lazar Karić</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=rejvban" title="Code">💻</a> <a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=rejvban" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/reharik"><img src="https://avatars2.githubusercontent.com/u/882382?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Raif Harik</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=reharik" title="Code">💻</a> <a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=reharik" title="Documentation">📖</a> <a href="#ideas-reharik" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Xerxes-J"><img src="https://avatars0.githubusercontent.com/u/18053412?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Xerxes Jarquin</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/issues?q=author%3AXerxes-J" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://www.lucasoconnell.net/"><img src="https://avatars1.githubusercontent.com/u/63400356?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lucas O'Connell</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=Isoaxe" title="Documentation">📖</a></td>
    <td align="center"><a href="http://www.keven.com.br"><img src="https://avatars.githubusercontent.com/u/5994795?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Keven Jesus</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/issues?q=author%3Akevenjesus" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/viniciusueharaweb"><img src="https://avatars.githubusercontent.com/u/77734864?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vinicius Uehara</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=viniciusueharaweb" title="Documentation">📖</a></td>
    <td align="center"><a href="http://orbiteleven.net"><img src="https://avatars.githubusercontent.com/u/331393?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Damon</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=orbiteleven" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/RavenHursT"><img src="https://avatars.githubusercontent.com/u/496983?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matthew Marcus</b></sub></a><br /><a href="https://github.com/wellyshen/use-places-autocomplete/commits?author=RavenHursT" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
