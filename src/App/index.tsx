import React, { SFC } from 'react';
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
  const {
    ready,
    value,
    setValue,
    suggestions: { data }
  } = usePlacesAutocomplete();

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
            type="text"
            placeholder="test"
            disabled={!ready}
          />
          {data.length !== 0 && <ul css={list}>{renderList()}</ul>}
        </div>
      </div>
    </>
  );
};

export default App;
