# Content Remixer

A simple React application that helps you remix and reimagine text content using AI.

## Features

1. Paste in text you want to remix
2. Click a button to apply the remixing
3. Uses OpenAI's GPT-3.5 to generate creative variations
4. See the remixed output instantly

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your-api-key-here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- OpenAI API for content remixing
- Vite for build tooling

## Usage

1. Enter your text in the input box
2. Click "Remix Content"
3. Wait for the AI to process your text
4. View the remixed version in the output box

## Note

Make sure to replace the OpenAI API key in the `.env` file with your actual API key from [OpenAI's platform](https://platform.openai.com/api-keys).