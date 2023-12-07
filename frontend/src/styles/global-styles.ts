import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    a {
      text-decoration: none;
    }
    li {
      list-style: none;
    }

    button {
      outline: none;
      border: none;
    }
    ::-webkit-scrollbar {
      width: 8px; 
    }

    ::-webkit-scrollbar-track {
      background-color: #000;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #555;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #888;
    }
  }

  :root {
    --color-black: #000;
    --color-white: #F2F3F5;
    --color-dark: #1E1F22;
    --color-grey: #313338;
    --color-softgrey: #969BA1;
    --color-softblue: #66bcff;
    --color-blue: #4752C4;
    --color-darkblue: #404EED;
    --color-red: #F0382B;
  }

  body,
  html,
  #root {
    height: 100%;
  }

  body,
  html {
    background-color: #1a1a1a;
    font-family: 'Inter';
    color: #fff;
  }

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 1.6rem;
  }

  html {
    font-size: 62.5%;

    @media (max-width: 768px) {
      font-size: 50%;
    }

    @media (max-width: 400px) {
      font-size: 40%;
    }
  }

  
`
