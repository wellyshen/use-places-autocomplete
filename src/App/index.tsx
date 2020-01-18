import React, { SFC, ChangeEvent, useState } from 'react';
import useOnclickOutside from 'react-cool-onclickoutside';
import { Global, css } from '@emotion/core';
import normalize from 'normalize.css';

import GitHubCorner from '../GitHubCorner';
import usePlacesAutocomplete from '../usePlacesAutocomplete';
import {
  root,
  container,
  title,
  subtitle,
  autocomplete,
  wrapper,
  withSuggestions,
  input,
  list,
  listItem
} from './styles';

type Suggestion = google.maps.places.AutocompletePrediction;

const App: SFC<{}> = () => {
  const [focused, setFocused] = useState(false);
  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete();
  const ref = useOnclickOutside(() => {
    setFocused(false);
    clearSuggestions();
  });

  const handleFocus = (): void => {
    setFocused(true);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }: Suggestion) => (): void => {
    setValue(description, true);
    clearSuggestions();
  };

  const renderSuggestions = (): JSX.Element[] =>
    data.map((suggestion: Suggestion) => (
      <li
        key={suggestion.id}
        css={listItem}
        onClick={handleSelect(suggestion)}
        role="presentation"
      >
        {suggestion.description}
      </li>
    ));

  const showSuggestions = focused && data.length !== 0;

  return (
    <>
      <Global
        styles={css`
          ${normalize}
          ${root}
        `}
      />
      <div css={container}>
        <GitHubCorner url="https://github.com/wellyshen/use-places-autocomplete" />
        <h1 css={title}>usePlacesAutocomplete</h1>
        <p css={subtitle}>React hook for Google Maps Places Autocomplete.</p>
        <div css={autocomplete} ref={ref}>
          <div css={showSuggestions ? [wrapper, withSuggestions] : wrapper}>
            <input
              css={input}
              value={value}
              onChange={handleInput}
              onFocus={handleFocus}
              placeholder="Enter a place"
              type="text"
              disabled={!ready}
            />
          </div>
          {showSuggestions && <ul css={list}>{renderSuggestions()}</ul>}
        </div>
      </div>
    </>
  );
};

export default App;
