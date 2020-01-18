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
`;

export const subtitle = css`
  margin: 0 0 2.5rem;
`;

export const autocomplete = css`
  width: 12rem;
`;

export const input = css`
  width: 100%;
`;

export const list = css`
  position: absolute;
  margin: 0.5rem 0 0;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style-type: none;
  text-align: left;
`;

export const listItem = css`
  max-width: 30rem;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
  cursor: pointer;
`;
