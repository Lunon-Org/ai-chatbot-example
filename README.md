# Lumon Magic Box Demo

A Severance-inspired AI chatbot demo showcasing the capabilities of Lunon.

## Overview

This project is a Nuxt.js application that demonstrates an AI-powered "Magic Box" chatbot interface, inspired by the Apple TV+ show "Severance". It uses the Lunon API to power the AI interactions, where the chatbot roleplays as a character from the show.

## Prerequisites

- Node.js (v16 or newer)
- npm or yarn
- A Lunon API key ([Get one here](https://lunon.com))

## Setup Instructions

1. Get a Lunon API Key
    - Sign up at [https://lunon.com](https://lunon.com)
    - Navigate to your dashboard and generate a new API key
    - Keep this key secure as you'll need it in the next steps

2. Clone the repository

3. Install dependencies
    ```bash
    npm install
    # or
    yarn install
    ```

4. Replace the API key
    ```bash
    # Open the MagicBoxLanding.vue file and find this line:
    Authorization: "Bearer sk-lunon-",
        
    # Replace it with your Lunon API key:
    Authorization: "Bearer sk-lunon-YOUR_API_KEY",
    ```

5. Start the development server
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. Open your browser and navigate to http://localhost:3000