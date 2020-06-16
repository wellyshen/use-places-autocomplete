import React, { FC, ChangeEvent, KeyboardEvent, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { Global, css } from "@emotion/core";
import normalize from "normalize.css";

import GitHubCorner from "../GitHubCorner";
import usePlacesAutocomplete from "../../src";
import {
  root,
  container,
  title,
  subtitle,
  autocomplete,
  input,
  inputNoBottomRadius,
  listBox,
  listItem,
  listItemDarken,
  subText,
  logo,
} from "./styles";

let cachedVal = "";
const acceptedKeys = [38, 40, 13, 27];

type Suggestion = google.maps.places.AutocompletePrediction;

const App: FC = () => {
  const [currIndex, setCurrIndex] = useState<number | null>(null);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();
  const hasSuggestions = status === "OK";

  const dismissSuggestions = (): void => {
    setCurrIndex(null);
    clearSuggestions();
  };

  const ref = useOnclickOutside(dismissSuggestions);

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
    cachedVal = e.target.value;
  };

  const handleSelect = ({ description }: Suggestion) => (): void => {
    setValue(description, false);
    dismissSuggestions();
  };

  const handleEnter = (idx: number) => (): void => {
    setCurrIndex(idx);
  };

  const handleLeave = (): void => {
    setCurrIndex(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (!hasSuggestions || !acceptedKeys.includes(e.keyCode)) return;

    if (e.keyCode === 13 || e.keyCode === 27) {
      dismissSuggestions();
      return;
    }

    let nextIndex: number;

    if (e.keyCode === 38) {
      e.preventDefault();
      nextIndex = currIndex ?? data.length;
      nextIndex = nextIndex > 0 ? nextIndex - 1 : null;
    } else {
      nextIndex = currIndex ?? -1;
      nextIndex = nextIndex < data.length - 1 ? nextIndex + 1 : null;
    }

    setCurrIndex(nextIndex);
    setValue(data[nextIndex] ? data[nextIndex].description : cachedVal, false);
  };

  const renderSuggestions = (): JSX.Element => {
    const suggestions = data.map((suggestion: Suggestion, idx: number) => {
      const {
        id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          key={id}
          id={`ex-list-item-${idx}`}
          css={idx === currIndex ? [listItem, listItemDarken] : listItem}
          onClick={handleSelect(suggestion)}
          onMouseEnter={handleEnter(idx)}
          role="option"
          aria-selected={idx === currIndex}
        >
          <strong>{main_text}</strong>{" "}
          <small css={subText}>{secondary_text}</small>
        </li>
      );
    });

    return (
      <>
        {suggestions}
        <li css={logo}>
          <img
            src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
            alt="Powered by Google"
          />
        </li>
      </>
    );
  };

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
        <div
          css={autocomplete}
          ref={ref}
          // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
          role="combobox"
          aria-owns="ex-list-box"
          aria-haspopup="listbox"
          aria-expanded={hasSuggestions}
        >
          <input
            css={hasSuggestions ? [input, inputNoBottomRadius] : input}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={!ready}
            placeholder="Where are you going?"
            type="text"
            aria-autocomplete="list"
            aria-controls="ex-list-box"
            aria-activedescendant={
              currIndex !== null ? `ex-list-item-${currIndex}` : null
            }
          />
          {hasSuggestions && (
            <ul
              id="ex-list-box"
              css={listBox}
              onMouseLeave={handleLeave}
              role="listbox"
            >
              {renderSuggestions()}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default App;
