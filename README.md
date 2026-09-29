# Reaktivate TDD — Fast-Test Books

Flat-presentation MVP refactor: View → Controller → Repository → Gateway, with MobX for state and logic covered by tests.

## Architecture

| Layer | Role |
|-------|------|
| **View** (`*.view.js`) | Renders only; binds actions to the controller; observes the view model via `mobx-react` |
| **Controller** (`Books.controller.js`) | Business/UX logic, MobX observables (VM) |
| **Repository** (`Books.repository.js`) | Maps API DTOs ↔ programmers model (PM) |
| **Gateway** (`ApiGateway.js`) | HTTP `fetch` to the demo API |

## Setup

1. **Allow the self-signed SSL certificate** — open any API URL in the browser once and accept the certificate warning, e.g.  
   https://tdd.demo.reaktivate.com/v1/books/postnikov/
2. Install dependencies: `npm install`
3. Start the app: `npm start`
4. Run tests: `npm test`

## Features

- List books from the API
- Add a book (name + author)
- Switch between **All books** and **Private books** (mutually exclusive)
- Sticky header showing private books count: `Your books: N`
