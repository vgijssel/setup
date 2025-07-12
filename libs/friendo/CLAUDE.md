# Friendo - Textual Application

## Usage

Use the Taskfile as the entrypoint for all important commands:

- `task dev` - Start the textual application and serve it on port 8000
- `task test` - Run tests

## Testing

- When testing a textual application run `task test`
- Write pytest tests using textual-based tests: https://textual.textualize.io/guide/testing/

## Validation

- When validating a textual application run `task dev` to navigate to localhost:8000 and interact with the application using playwright

## Technology Stack

- Friendo is a uv based application