import type { FC, ChangeEvent } from "react";
import { KeyboardEvent, useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

import GitHubCorner from "../GitHubCorner";
import styles from "./styles.module.scss";

let cachedVal = "";
const acceptedKeys = ["ArrowUp", "ArrowDown", "Escape", "Enter"];

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

  const dismissSuggestions = () => {
    setCurrIndex(null);
    clearSuggestions();
  };

  const ref = useOnclickOutside(dismissSuggestions);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    cachedVal = e.target.value;
  };

  const handleSelect =
    ({ description }: Suggestion) =>
    () => {
      setValue(description, false);
      dismissSuggestions();
    };

  const handleEnter = (idx: number) => () => {
    setCurrIndex(idx);
  };

  const handleLeave = () => {
    setCurrIndex(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasSuggestions || !acceptedKeys.includes(e.key)) return;

    if (e.key === "Enter" || e.key === "Escape") {
      dismissSuggestions();
      return;
    }

    let nextIndex: number | null;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = currIndex ?? data.length;
      nextIndex = nextIndex && nextIndex > 0 ? nextIndex - 1 : null;
    } else {
      nextIndex = currIndex ?? -1;
      nextIndex = nextIndex < data.length - 1 ? nextIndex + 1 : null;
    }

    setCurrIndex(nextIndex);
    // @ts-ignore
    setValue(data[nextIndex] ? data[nextIndex].description : cachedVal, false);
  };

  const renderSuggestions = (): JSX.Element => {
    const suggestions = data.map((suggestion: Suggestion, idx: number) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          key={place_id}
          id={`ex-list-item-${idx}`}
          className={`${styles["list-item"]} ${
            idx === currIndex ? `${styles["list-item-darken"]}` : ""
          }`}
          onClick={handleSelect(suggestion)}
          onMouseEnter={handleEnter(idx)}
          role="option"
          aria-selected={idx === currIndex}
        >
          <strong>{main_text}</strong>
          <small className={styles["sub-text"]}>{secondary_text}</small>
        </li>
      );
    });

    return (
      <>
        {suggestions}
        <li className={styles.logo}>
          <img
            src="https://developers.google.com/maps/documentation/images/powered_by_google_on_white.png"
            alt="Powered by Google"
          />
        </li>
      </>
    );
  };

  return (
    <div className={styles.container}>
      <GitHubCorner url="https://github.com/wellyshen/use-places-autocomplete" />
      <h1 className={styles.title}>USE-PLACES-AUTOCOMPLETE</h1>
      <p className={styles.subtitle}>
        React hook for Google Maps Places Autocomplete.
      </p>
      <div
        className={styles.autocomplete}
        ref={ref}
        // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
        role="combobox"
        aria-owns="ex-list-box"
        aria-haspopup="listbox"
        aria-expanded={hasSuggestions}
      >
        <input
          className={styles.input}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={!ready}
          placeholder="WHERE ARE YOU GOING?"
          type="text"
          aria-autocomplete="list"
          aria-controls="ex-list-box"
          aria-activedescendant={
            currIndex !== null ? `ex-list-item-${currIndex}` : undefined
          }
        />
        {hasSuggestions && (
          <ul
            id="ex-list-box"
            className={styles["list-box"]}
            onMouseLeave={handleLeave}
            role="listbox"
          >
            {renderSuggestions()}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
