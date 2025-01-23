# 360 Planner

This project is for an AI assisted task decomposition system.

### Setting up the frontend environment

- Ensure node.js and npm are installed using a version manager
- Currently we are using `node 23.3.0`
- We are using Nextjs 15.1.1 for the frontend. In the root directory:

```npx create-next-app@latest

create-next-app@15.1.1
Ok to proceed? (y) y

√ What is your project named? ... planner-dashboard
√ Would you like to use TypeScript? ... No / Yes
√ Would you like to use ESLint? ... No / Yes
√ Would you like to use Tailwind CSS? ... No / Yes
√ Would you like your code inside a `src/` directory? ... No / Yes
√ Would you like to use App Router? (recommended) ... No / Yes
√ Would you like to use Turbopack for `next dev`? ... No / Yes
√ Would you like to customize the import alias (`@/*` by default)? ... No / Yes
```

### Starting the project -- Frontend

- Navigate to the `` directory
- Run `npm run dev` to begin the frontend server in developer mode

#### Git Hooks

- Husky
  - `npm install --save-dev husky lint-staged`
  - `npx husky init`

#### Linters

- CSS:
  - Install stylelint and initialize (https://stylelint.io/):
    - `npm init stylelint`
  - Run stylelint:
    - `npx stylelint "**/*.scss"`
- Javascript
  - Install eslint and: \*`npm init @eslint/config@latest`

````
√ How would you like to use ESLint? · problems
√ What type of modules does your project use? · esm
√ Which framework does your project use? · react
√ Does your project use TypeScript? · typescript
√ Where does your code run? · browser, node
The config that you've selected requires the following dependencies:

eslint, globals, @eslint/js, typescript-eslint, eslint-plugin-react
√ Would you like to install them now? · No / Yes
√ Which package manager do you want to use? · npm```
* Code Formatter:
    * Prettier
        *`npm install --save-dev --save-exact prettier`
        *`npm install --save-dev eslint-config-prettier`


````
