import React, { SFC, useState } from 'react';
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
  input,
  list,
  listItem
} from './styles';

const App: SFC<{}> = () => {
  const [focused, setFocused] = useState(false);
  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete();

  const handleFocus = (): void => {
    clearSuggestions();
    setFocused(true);
  };

  const handleBlur = (): void => {
    setFocused(false);
  };

  const renderList = (): JSX.Element[] =>
    data.map(({ id, description }: { id: string; description: string }) => (
      <li key={id} css={listItem}>
        {description}
      </li>
    ));

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
        <div css={autocomplete}>
          <input
            css={input}
            value={value}
            onChange={setValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Enter your place"
            type="text"
            disabled={!ready}
          />
          {focused && data.length !== 0 && <ul css={list}>{renderList()}</ul>}
        </div>
      </div>
    </>
  );
};

export default App;
