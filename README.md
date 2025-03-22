# Care Bridge

A place where hire trusted Baby Sitters for your children and Family Care services


## Authors
- [Bhaskar Khoraja](https://www.github.com/bhaskarkhoraja)



## Installation

First clone the project
```bash
  git clone https://github.com/bhaskarkhoraja/care-bridge
```

Go to the project directory

```bash
  cd care-bridge
```

Install Dependency

```bash
  pnpm install
```

## Account neededs

**Github auth app**: For github login

**Google project app**: For google login

**Nodemailer**: For email login

**UploadThing**: For storing images in cloud

**Paypal developer account**: For payment



## Environment Variables

Before running the project, you will need to add the following environment variables to your .env file in your root directory. For reference copy the content in .env.example.

Failing to setup database will cause the build process to fail.

## Setup

Create database (require postgres) (from root)

```bash
  CREATE DATABASE care_bridge;
```

Migration (require sqlx) (from root)

```bash
  cd apps/server
  sqlx database setup
```

Seeding database (require ts-node) (from root)
```bash
  cd apps/server/src/utils
  node --env-file=../../../../.env -r ts-node/register ./countrySeeder.ts
```

### Buildiing appliction
(If you face any build issue related to missing environment variable, please setup environment variable properly first.)
Web (from root)
```bash
   cd apps/web
   pnpm run build
```
Server (from root)
```bash
   cd apps/server
   pnpm run build
```
Contract (from root)
```bash
   cd packages/api-contract
   pnpm run build
```

### Running application
Web (from root)
```bash
   cd apps/web
   pnpm run start
```
Server (from root)
```bash
   cd apps/server
   pnpm run start:prod
```
## License

[MIT](https://choosealicense.com/licenses/mit/)


## Database
You might have got the database with 2 users, you can register and alter the database to get admin access (user table, role column).
Import the database and run the project
