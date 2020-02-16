import { css } from '@emotion/core';

import mq from '../utils/mq';

const { sm, md, lg } = mq;

export const root = css`
  body {
    font-family: 'Open Sans', sans-serif;
  }
`;

export const container = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5rem 5%;
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
  margin: 0 0 0.75rem;
  font-size: 1.5rem;
  ${sm} {
    font-size: 2rem;
  }
`;

export const subtitle = css`
  margin: 0 0 2.5rem;
`;

export const autocomplete = css`
  display: inline-block;
`;

export const input = css`
  padding: 0.9rem 1.15rem;
  width: 15rem;
  border: 1px solid #bbb;
  border-radius: 8px;
  outline: none;
  line-height: 1.2;
  ${sm} {
    width: 20rem;
  }
`;

export const inputNoBottomRadius = css`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
`;

export const listBox = css`
  position: absolute;
  margin: -1px 0 0;
  padding: 0;
  max-height: 60%;
  overflow-y: auto;
  border: 1px solid #bbb;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  list-style-type: none;
  text-align: left;
`;

export const listItem = css`
  padding: 0.75rem 1.15rem;
  width: 15rem;
  cursor: default;
  ${sm} {
    width: 20rem;
  }
`;

export const listItemDarken = css`
  background: #eee;
`;

export const subText = css`
  color: #8c8c8c;
`;
