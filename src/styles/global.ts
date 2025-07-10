import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html{
        width: 100%;
        height: 100%;
    }

    body{
        background: #e1e1e6;
        color: #121214;
        font: 400 16px Roboto, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        flex-direction: column;
    }

    #__next{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;