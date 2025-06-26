const notesData = {
  "Day_1": {
    topic: "Lesson 1",
    notes: [
      {
        title: "Task 1.1",
        color: "#00e0d1",
        items: [
          "Node.js lets you create interactive websites; it is a JavaScript runtime that runs scripts on the server side.",
          "JavaScript is an interpreted runtime language; code is executed while running.",
          "TypeScript is transpiled into JavaScript; it adds static typing."
        ]
      },
      {
        title: "Task 1.2",
        color: "#fcae66",
        items: [
          "Visual Studio Code supports debugging, syntax highlighting, intelligent code completion, snippets, refactoring, and embedded Git.",
          "Version Control allows multiple people to work on the same project; last version wins.",
          "ESLint helps find and fix coding problems.",
          "GitHub Desktop lets you revert or reset with right-click history.",
          "Pages define navigation and structure for your project."
        ]
      },
      {
        title: "Task 1.3",
        color: "#7edc84",
        items: [
          "Git is a version control system for backups and managing code versions.",
          "Repository is where your project files are stored.",
          "Commit changes save snapshots of your work.",
          "Branches let multiple people work on different parts simultaneously.",
          "Remote GitHub syncs your local repo with the cloud.",
          "Stage changes prepares files for commit; commit saves them.",
          "Fetch downloads changes; pull downloads and merges them.",
          "Push uploads your changes to GitHub.",
          "Merge combines commits into one.",
          ".gitignore tells Git which files to ignore (e.g., passwords).",
          "The '.git' folder stores Git's database and metadata (hidden)."
        ]
      },
      {
        title: "Task 1.4",
        color: "#ff8080",
        items: [
          "Git Graph shows branches and commits visually, focusing on relationships.",
          "GitHub stash temporarily saves your changes.",
          "Git differs from Dropbox/Drive by keeping full history and working copies.",
          "Git’s name comes from Linux slang, meaning a silly or unpleasant person.",
          "Delete all untracked files locally: `git clean -xdf`.",
          "Rebase moves your branch changes onto master for linear history.",
          "Squash combines multiple commits into one for cleaner history."
        ]
      }
    ]
  },

  "Day_2": {
    topic: "Lesson 2",
    notes: [
      {
        title: "Task 2.1",
        color: "#00e0d1",
        items: [
          "Finde out the meaning of the akronym HTML  Hyper Text Markup Language Web of Text and Structure",
          "Tome Berners-Lee made HTML to help CERN researchers organize scientific information 1993",
          "Derived from the traditional publishing practice called marking up a manuscript",
          "Syntax refers to the rules the structure and arrangement of words and phrases in a sentence",
          "Semantics deals with the meaning of those words and how they relate to each other",
          "First Site World Wide Web",
        ]
      },

      {
        title: "Task02.2",
        color: "#fcae66",
        items: [
          ".text Pre formatet Text creat a body",
          ".html pre is lost because there is no markuplanguage",
          "DOM(Document Object Modell)  a hierarchical representation of an HTML or XML document",
          " .HTML> .HEAD> ./HEAD>.body> ./body> ./HTML> ",
        ]
      },

      {
        title: "Task02.4",
        color: "#7edc84",
        items: [
          "Objekt Pile of Date With Attributs tagename attributs do something",
          "UTF-8 Encoding Tabel for Encoding",
          "(A) stand link to somewhere (Anker)",
          "Input dont need closing tag placeholder",
          "Br should not be used allways use p ",
          "Legend in field a titel",
          "In HTML there are 4 Categorize of Typs of Input, Media, Text, Other",
        ]
      },
    ]
  },

  "Day_3": {
    topic: "Lesson 3",
    notes: [
      {
        title: "Task3",
        color: "#00e0d1",
        items: [
          "Cascading Style Sheets, Cascade means styling in Hierarchy",
          "Class with . can be used to identify more than one",
          "ID with # be used to identify one element",
          "Root with : can be used to change the whole document",
          "Inline & internal never write in html ",
          "Always wirte in external",
        ]
      },
    ]
  },


  "Day_4": {
    topic: "Lesson 4",
    notes: [
      {
        title: "TypScript",
        color: "#00e0d1",
        items: [
          "Use tools like draw.io for activity diagram, Debugger check source code and debug errors",
          "Debugger check source code and debug errors",
          "Use console.log first to check what you write in the code",
          "The compiler needs a tsconfig.json for configurate file",
          "activity diagram note 4 typ start, activity, objekt, end",
          "Check version tsc tsc -v, new config creat tsc --init, after that Terminal build and run ",
          "esnext refers to latest JsScript version",
          "String (text), Boolean (true/false), Number(numeric values), Void",
        ]
      },
      {
        title: "Problem-Solving",
        color: "#fcae66",
        items: [
          "What to do When Encounter an Error 1. Analyze behavior, 2 Gather information, 3 console.log 4. write exactly what are you trying",
          "Ask tutor after 15min, explain what you did, link live server",
          "1 commen Problem (forgot compile, Script linked, missing parentheses, wrong folder",
          "2 Read Error Messages + 3 Use the Debugger + 4 Isolate code + Use console.log",
          "6 Step Through your code, 7 Rubber Duck Method",
          "4 Typs of Error Design-time Error, Compile-time Error, Runtime Error, Logical Error",
          "Preventive Measures follow coding guidelines, small changes to run programm",
          "Git pushes, browser console and log",
        ]
      },
      {
        title: "Complex Data Types",
        color: "#7edc84",
        items: [
          "Contain primitive values, contain complex types",
          "Homogenous Structures number [ ] =[1,2,3]",
          "Heterogeneous Structures Elements can be of different types, Example: an object",
          "Indices start at [0], Key-Value [zahl]",
          "TypScript is struckture, JS inline"
        ]
      },
      {
        title: "Funktion",
        color: "#ff8080",
        items: [
          "name, list of parameters(inputs),body (code to run), Optionally return value",
          "What Functions do Process input, return output, can be called from other parts of the program",
          "Type Annotations for Parameter return, no function overloading by signature, Early return, Coding Style",
          "Object as Associative Arrays with Methods, Objects in JS is primitive typs",
          "name, list of parameters(inputs),body (code to run), Optionally return value",
          "Primitive (number,boolean, string)  vs Complex Type (objects or arrays) ",
          "Forgetting that complex types are referenced and not copied by value often leads to bugs",
        ]
      }
    ]
  },


  "Day_5": {
    topic: "Lesson 5",
    notes: [
      {
        title: "Task 04.2",
        color: "#00e0d1",
        items: [
          "Start note (initial),Action note (rectangle),Object note (rectangle with rounded corners), Decision (diamond shape) End note",
           "Never use var because it can overwrite variables from other scopes (within curly braces)",
          "Use namespaces to separate concerns",
          "A namespace becomes a local variable in JavaScript",
          "JavaScript doesn't have true namespaces like other languages (e.g., C#). Instead, use objects or modules to simulate them",
          "Use === to compare both value and type (strict equality)",
          "break skips the rest of the loop and jumps out of it, alert() shows a text popup in the browser",
          "Convert a string to a number using Number().",
          
        ]
      },
      {
        title: "Task 5.2",
        color: "#fcae66",
        items: [
      
        ]
      },
      {
        title: "Task 5.3",
        color: "#7edc84",
        items: []
      },
      {
        title: "Task 5.4",
        color: "#ff8080",
        items: []
      }
    ]
  },

  "Day_6": {
    topic: "Lesson 6",
    notes: [
      {
        title: "Task 6.1",
        color: "#00e0d1",
        items: []
      },
      {
        title: "Task 6.2",
        color: "#fcae66",
        items: []
      },
      {
        title: "Task 6.3",
        color: "#7edc84",
        items: []
      },
      {
        title: "Task 6.4",
        color: "#ff8080",
        items: []
      }
    ]
  },

  "Day_7": {
    topic: "Lesson 7",
    notes: [
      {
        title: "Task 7.1",
        color: "#00e0d1",
        items: []
      },
      {
        title: "Task 7.2",
        color: "#fcae66",
        items: []
      },
      {
        title: "Task 7.3",
        color: "#7edc84",
        items: []
      },
      {
        title: "Task 7.4",
        color: "#ff8080",
        items: []
      }
    ]
  }
};
