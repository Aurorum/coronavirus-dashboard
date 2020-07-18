// @flow

import React from "react";
import styled from 'styled-components';
import type { ComponentType } from 'react';


export const InlineContainer: ComponentType<*> = (() => {

    return styled.div`
        width: 100%;
        margin: 0;
    `

})();


export const OverlayContainer: ComponentType<*> = (() => {

    return styled.div`
        position: fixed;
        bottom: 0;
        width: 100%;
        z-index: 1234567;
        padding: 0;
        background: transparent;
    `

})();


export const Link: ComponentType<*> = (() => {

    return styled
        .button
        .attrs(({ className="" }) => ({
            className: `${ className } govuk-link govuk-link--no-visited-state govuk-body-s`
        }))`
            padding: .5em .5em 2em .5em;
            background: rgba(255, 255, 255, .8);
            color: #1d70b8;
            cursor: pointer;
            margin-bottom: 0;
        `

})();


export const Container = (() => {

  return styled
      .button
      .attrs(({ className="" }) => ({
          className: `${ className } govuk-width-container`
      }))`
          padding: 0;
          margin: 0;
      `

  // <div className={ `govuk-width-container ${className}` } { ...props }/>

})();
