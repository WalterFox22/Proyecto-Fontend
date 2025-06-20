import React from 'react';
import styled from 'styled-components';

const ButtonRestPassword = () => {
  return (
    <StyledWrapper>
      <button className="btn-1">
        <div className="original">Confirmar</div>
        <div className="letters">
          <span>C</span>
          <span>o</span>
          <span>n</span>
          <span>f</span>
          <span>i</span>
          <span>r</span>
          <span>m</span>
          <span>a</span>
          <span>r</span>
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn-1,
  .btn-1 *,
  .btn-1 :after,
  .btn-1 :before,
  .btn-1:after,
  .btn-1:before {
    border: none;
    box-sizing: border-box;
  }

  .btn-1 {
    scale: 0.8;
    -webkit-tap-highlight-color: transparent;
    background-color: #000;
    background-image: none;
    color: #fff;
    font-family:
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      Segoe UI,
      Roboto,
      Helvetica Neue,
      Arial,
      Noto Sans,
      sans-serif,
      Apple Color Emoji,
      Segoe UI Emoji,
      Segoe UI Symbol,
      Noto Color Emoji;
    cursor: pointer;
    font-size: 100%;
    line-height: 1.5;
    margin: 0;
    padding: 2;
  }

  .btn-1:disabled {
    cursor: default;
  }

  .btn-1:-moz-focusring {
    outline: auto;
  }

  .btn-1 svg {
    display: block;
    vertical-align: middle;
  }

  .btn-1 [hidden] {
    display: none;
  }

  .btn-1 {
    border: 1px solid;
    border-radius: 999px;
    box-sizing: border-box;
    display: block;
    font-weight: 900;
    overflow: hidden;
    padding: 1.2rem 3rem;
    position: relative;
    text-transform: uppercase;
  }

  .btn-1 .original {
    background: #ffffff;
    color: #000;
    display: grid;
    inset: 0;
    place-content: center;
    position: absolute;
    transition: transform 0.3s cubic-bezier(0.87, 0, 0.13, 1);
  }

  .btn-1:hover .original {
    transform: translateY(100%);
  }

  .btn-1 .letters {
    display: inline-flex;
  }

  .btn-1 span {
    opacity: 0;
    transform: translateY(-15px);
    transition:
      transform 0.3s cubic-bezier(0.87, 0, 0.13, 1),
      opacity 0.3s;
  }

  .btn-1 span:nth-child(2n) {
    transform: translateY(15px);
  }

  .btn-1:hover span {
    opacity: 1;
    transform: translateY(0);
  }

  .btn-1:hover span:nth-child(2) {
    transition-delay: 0.1s;
  }

  .btn-1:hover span:nth-child(3) {
    transition-delay: 0.2s;
  }

  .btn-1:hover span:nth-child(4) {
    transition-delay: 0.3s;
  }

  .btn-1:hover span:nth-child(5) {
    transition-delay: 0.4s;
  }

  .btn-1:hover span:nth-child(6) {
    transition-delay: 0.5s;
  }
  
  .btn-1:hover span:nth-child(7) {
    transition-delay: 0.6s;
  }

  .btn-1:hover span:nth-child(8) {
    transition-delay: 0.7s;
  }

  .btn-1:hover span:nth-child(9) {
    transition-delay: 0.8s;
  }`;

export default ButtonRestPassword;
