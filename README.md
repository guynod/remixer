# Content Remixer

A simple React application that helps you remix and reimagine text content using Perplexity AI.

## Features

1. Paste in text you want to remix
2. Click a button to apply the remixing
3. Uses Perplexity AI's Mixtral-8x7b model to generate creative variations
4. See the remixed output instantly

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Perplexity API key:
   ```
   VITE_PERPLEXITY_API_KEY=your-perplexity-api-key-here
   ```
   You can get your API key by:
   - Going to https://www.perplexity.ai/settings
   - Clicking on the "API" tab
   - Creating a new API key
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Perplexity AI API for content remixing
- Vite for build tooling

## Usage

1. Enter your text in the input box
2. Click "Remix Content"
3. Wait for Perplexity to process your text
4. View the remixed version in the output box

## Note

Make sure to keep your Perplexity API key secure and never commit it to version control. The `.env` file is already included in `.gitignore` for your security.