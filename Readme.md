## TechStack

- **Frontend**: ReactJS + Typescript + Tailwind-css + ReactFlow + Redux + MUI
- **Backend**: NestJs + PostgreSql + Typeorm + Typescript + class-transformer + class-validator

### Features

- **React-Flow**: Allows creation of workflows with drag and drop nodes:
  - 'Start node'
  - 'Filter Data node': Converts Csv columns to lowercase
  - 'Wait node': Waits for 5 Seconds
  - 'Convert Format node': Converts CSV file to JSON 
  - 'Send POST Request node'
  - 'End node'
- Select and run workflows on the run-workflow page.
- **react-router-dom** for routing.
- **redux** for state management like error state, success state, and nav-state.
- Progress bar with **Server-Side-Events (SSE)/EventSource**.

## Work Flow Home
![work-flow-home](./img/home/page.png)

## Save to get work-flow-id
![work-flow-home](./img/home/save.png)

## Nav-bar
![work-flow-home](./img/nav-bar.png)

## Run-workflow with different routing
![work-flow-home](./img/run-workflow/home.png)

## Working Progress-Bar
![work-flow-home](./img/run-workflow/working.png)

## Post Request Working
![work-flow-home](./img/post-req.png)

### To Run

1. Change **./frontend/env.env** to **./frontend/.env**.
2. Change **./backend/env.env** to **./backend/.env**.
3. Run the following commands in the terminal:
   1. `cd frontend`
   2. `npm i`
   3. `cd ..`
   4. `cd backend`
   5. `npm i`
4. Setup Postgres according to `./backend/.env`.
5. Open 2 separate terminals:
   1. In the first one, `cd frontend` and run `npm run start`.
   2. In the second one, `cd backend` and run `npm run start:dev`.
