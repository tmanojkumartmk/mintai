# MintAI

This is a chat application that uses Gemini for generating responses.

## Getting Started

### Prerequisites

* Node.js
* npm
* PostgreSQL
* RabbitMQ
* Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/mintai.git
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and copy the contents of `.env.example` into it. Then, fill in the required environment variables.

## Running the application

To start the server, run:

```bash
npm start
```

To start the consumer, run:

```bash
npm run dev:consumer
```

## API Endpoints

The API has the following endpoints:

*   **Auth:**
    *   `POST /register`
    *   `POST /otp/verify`
    *   `POST /login`
*   **Chatroom:**
    *   `POST /chatroom`
    *   `GET /chatroom`
    *   `GET /chatroom/:id`
    *   `POST /chatroom/:id/message`
    *   `GET /chatroom/:id/messages`

For more details, you can use the Postman collection provided in the repository.
