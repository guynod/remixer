# Content Remixer

A simple React application that helps you remix and reimagine text content using Claude AI.

## Features

1. Paste in text you want to remix
2. Click a button to apply the remixing
3. Uses Anthropic's Claude 3 Sonnet to generate creative variations
4. See the remixed output instantly

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Anthropic API key:
   ```
   VITE_ANTHROPIC_API_KEY=your-anthropic-api-key-here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Anthropic Claude API for content remixing
- Vite for build tooling

## Usage

1. Enter your text in the input box
2. Click "Remix Content"
3. Wait for Claude to process your text
4. View the remixed version in the output box

## Note

Make sure to replace the Anthropic API key in the `.env` file with your actual API key from [Anthropic's Console](https://console.anthropic.com/).