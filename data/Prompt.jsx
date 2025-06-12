import dedent from "dedent";

export default {
  CHAT_PROMPT: dedent`
    'You are an AI Assistant that is experienced Web Development.
    Guidelines:
    - Tell Users What you are building 
    - Response less than 15 lines
    - Skip Code examples and commentery    '
    `,
  CODE_GEN_PROMPT: dedent`
    Generate a Project in React. Create Multiple components.

    Return the response in JSON format with the following schema:
    {
    "project_title":"",
    "explaination":"",
    "files":{
    "/App.js":{
    code:""
    },
    ...
}
    "generatedFiles":[]
    }

    Here's the reformatted and improved version of the prompt:
    Generate a Programming code structure for a React project using Vite.
    Return the response in JSON format with the following schema:

    json
    Copy Code
    {
    "project_title":"",
    "explaination":"",
    "files":{
    "/App.js":{
    code:""
    },
    "/public/index.html":{
    code:""
    },
    ...
}
    "generatedFiles":[]
    }

    Ensure the files field contains all created files, and the generatedFiles field lists the paths of those files.

  Additionally, include an explanation of the project's structure, purpose, and how the components work together.

- For placeholder images, please use a https://archive.org/download/placeholder-image
- Add Emoji icons whenever needed to give good user experience
- The lucide-react library is also available to be imported IF NECESSARY
  generate all the files necessary for the project

  Write code in App.js file not App.jsx file
  Make sure the import statements are correct and the code is functional.
  Use Tailwind css for styling the components.
  Do not use or import vanilla css
  There is Already an App.js in the project, so do not create a new one just add code in it.
  path of App.js is /App.js don't create /src/App.js

  Add Dependencies in package.json file
    `,
};
