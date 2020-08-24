import { css } from "@emotion/core";

import mq from "../utils/mq";

const { sm, md, lg } = mq;

export const root = css`
  body {
    font-family: "Roboto", sans-serif;
    h1 {
      font-family: "Bungee Shade", cursive;
    }
  }
`;

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3.5rem 5%;
  text-align: center;
  ${sm} {
    padding-left: 10%;
    padding-right: 10%;
  }
  ${md} {
    padding-left: 12.5%;
    padding-right: 12.5%;
  }
  ${lg} {
    padding-left: 15%;
    padding-right: 15%;
  }
`;

export const title = css`
  margin: 0 0 1rem;
  font-size: 8vw;
  ${md} {
    font-size: 4vw;
  }
`;

export const subtitle = css`
  margin: 0 0 3.5rem;
  font-size: 3vw;
  ${md} {
    font-size: 1.5vw;
  }
`;

export const autocomplete = css`
  display: inline-block;
`;

export const input = css`
  padding: 1rem 1.2rem;
  width: 15rem;
  border: 5px solid;
  outline: none;
  font-weight: bold;
  line-height: 1.5;
  ${sm} {
    width: 20rem;
  }
`;

export const listBox = css`
  position: absolute;
  margin: 0;
  padding: 0;
  max-height: 60%;
  border: 5px solid;
  border-top: none;
  list-style-type: none;
  text-align: left;
  overflow-y: auto;
`;

export const listItem = css`
  padding: 1rem 1.2rem;
  width: 15rem;
  cursor: pointer;
  ${sm} {
    width: 20rem;
  }
`;

export const listItemDarken = css`
  color: #fff;
  background: #000;
`;

export const subText = css`
  margin-left: 0.5rem;
  color: #8c8c8c;
`;

export const logo = css`
  padding: 1rem 1.2rem;
  text-align: right;
`;
