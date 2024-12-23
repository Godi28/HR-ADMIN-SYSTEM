
# HR-ADMIN-SYSTEM

A T3-stack human resource management system.

## Getting Started

Follow the steps below to set up and run the project locally.

### Clone the Repository
Clone the repository or download the repository on github.

### Install dependencies 
open command prompt/power shell in the directory of the project you cloned or downloaded and run the following command:
npm install

### Set Up Environment in the env file
open the env. file from the project and set up the following variables

AUTH_SECRET=""

# Next Auth Discord Provider
AUTH_DISCORD_ID=""
AUTH_DISCORD_SECRET=""

### 5. Run Database Migrations
```bash
npx prisma migrate dev
```
### 6. Start the Development Server
```bash
npm run dev
```
### 7 . Access the Application
###### http://localhost:3000

### 8. Add Manager Instruction
Watch the video from 1:00 to 2:15 for instructions on adding a manager:
[Add Manager Instruction Video (1:00 to 2:15)](https://jam.dev/c/084fc5ea-a65c-4c85-8bb6-6563a4ff168b?t=1m0s)





