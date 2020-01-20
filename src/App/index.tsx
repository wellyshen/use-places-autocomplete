import React, { SFC, ChangeEvent } from 'react';
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
  listItem,
  listItemMatched
} from './styles';

type Suggestion = google.maps.places.AutocompletePrediction;

const App: SFC<{}> = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete();
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleSelect = ({ description }: Suggestion) => (): void => {
    setValue(description, false);
    clearSuggestions();
  };

  const renderSuggestions = (): JSX.Element[] =>
    data.map((suggestion: Suggestion) => {
      const { id, description } = suggestion;

      return (
        <li
          key={id}
          css={value === description ? [listItem, listItemMatched] : listItem}
          onClick={handleSelect(suggestion)}
          role="presentation"
        >
          {description}
        </li>
      );
    });

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
          <div css={status === 'OK' ? [wrapper, withSuggestions] : wrapper}>
            <input
              css={input}
              value={value}
              onChange={handleInput}
              placeholder="Enter a place"
              type="text"
              disabled={!ready}
            />
          </div>
          {status === 'OK' && <ul css={list}>{renderSuggestions()}</ul>}
        </div>
      </div>
    </>
  );
};

export default App;
