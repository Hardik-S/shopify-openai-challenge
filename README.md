# Shopify Intern Challenge Fall 2022

an app that sends plain text prompts to the
[OpenAI API](https://openai.com/api/) and displays the results in a list

## Extra #1

Successfully implemented `save responses if the user leaves or reloads the page`.

## Tech

React JS | CSS3 | CSS-modules | Adaptive design

## Installation & Usage

```bash
# Clone the repository
git clone https://github.com/Hardik-S/shopify-openai-challenge.git
# Enter the project directory
cd shopify-openai-challenge
# Install dependencies
npm i
```

Before starting the app, create a local `.env.local` file containing the
OpenAI key used for the challenge:

```bash
REACT_APP_OPEN_AI_SECRET=your-openai-key
```

The key is intentionally read by the browser for this historical challenge,
so `.env.local` is ignored and must never be committed. Do not deploy this
client-side key pattern to a real production app; production code should send
requests through a server-side endpoint that keeps the key private.

In the project directory, you can run:

`npm run go`

> Starts a local web server and builds the app for production. Open [http://localhost:3000](http://localhost:3000)
> to view it in your browser.

`npm run full`

> `npm run go` with css and js linters 
