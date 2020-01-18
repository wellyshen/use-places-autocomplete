import React, { SFC } from 'react';
import { Global, css } from '@emotion/core';
import normalize from 'normalize.css';

import GitHubCorner from '../GitHubCorner';
import usePlacesAutocomplete from '../usePlacesAutocomplete';
import { root, container, title, subtitle } from './styles';

const App: SFC<{}> = () => {
  const { ready, value, setValue, suggestions } = usePlacesAutocomplete();
  console.log('LOG ===> suggestions: ', suggestions);

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
        <input
          value={value}
          onChange={setValue}
          type="text"
          placeholder="test"
          disabled={!ready}
        />
      </div>
    </>
  );
};

export default App;
