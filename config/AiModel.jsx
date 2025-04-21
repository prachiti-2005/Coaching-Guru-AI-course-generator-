// const {
//     GoogleGenerativeAI,
//     HarmCategory,
//     HarmBlockThreshold,
//   } = require("@google/generative-ai");
  
//   const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
//   const genAI = new GoogleGenerativeAI(apiKey);
  
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash-exp",
//   });
  
//   const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseMimeType: "application/json",
//   };
   
 
//     export const GenerateTopicsAIModel = model.startChat({
//       generationConfig,
//       history: [
//         {
//           role: "user",
//           parts: [
//             {text: "Learn Python :: As your are coaching teacher\n-User want to learn about the topic\n-Generate 5-7 course title for study(short)\n-Make sure it is related to description\n-Output will be array of string in JSON FORMAT only\n-DO not add any plain text in output\n"},
//           ],
//         },
//         {
//           role: "model",
//           parts: [
//             {text: "```json\n{\n  \"course_titles\": [\n    \"Python Basics: Syntax & Data Types\",\n    \"Control Flow: Logic & Loops in Python\",\n    \"Functions & Modules: Code Organization\",\n    \"Data Structures: Lists, Dictionaries, Sets\",\n    \"Object-Oriented Programming (OOP) in Python\",\n    \"File Handling: Reading & Writing Data\",\n    \"Error Handling: Debugging Python Code\"\n  ]\n}\n```"},
//           ],
//         },
//       ],
//     });


//     export const GenerateCourseAIModel = model.startChat({
//       generationConfig,
//       history: [
       
//       ],
//     });
  
//     // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//     // console.log(result.response.text());
  

// version - 02

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
  
const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
  
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});
  
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};
      
export const GenerateTopicsAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Learn Python :: As your are coaching teacher\n-User want to learn about the topic\n-Generate 5-7 course title for study(short)\n-Make sure it is related to description\n-Output will be array of string in JSON FORMAT only\n-DO not add any plain text in output\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"course_titles\": [\n    \"Python Basics: Syntax & Data Types\",\n    \"Control Flow: Logic & Loops in Python\",\n    \"Functions & Modules: Code Organization\",\n    \"Data Structures: Lists, Dictionaries, Sets\",\n    \"Object-Oriented Programming (OOP) in Python\",\n    \"File Handling: Reading & Writing Data\",\n    \"Error Handling: Debugging Python Code\"\n  ]\n}\n```"},
      ],
    },
  ],
});
  
export const GenerateCourseAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Python Basics: Syntax & Data Types, Control Flow: Logic & Loops in Python :: As you are a coaching teacher\n-Generate a detailed course outline for these topics\n-Include subtopics, key points, and exercises for each topic\n-Output should be in JSON FORMAT only with proper structure\n-Structure should include: course_name, description, topics (array of objects with name, description, subtopics)\n-DO not add any plain text in output\n"},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"course_name\": \"Python Fundamentals: Syntax & Control Flow\",\n  \"description\": \"A comprehensive introduction to Python programming covering basic syntax, data types, and control flow mechanisms.\",\n  \"topics\": [\n    {\n      \"name\": \"Python Basics: Syntax & Data Types\",\n      \"description\": \"Learn the foundational elements of Python programming language.\",\n      \"subtopics\": [\n        {\n          \"title\": \"Python Syntax Basics\",\n          \"content\": \"Understanding indentation, comments, and basic code structure\",\n          \"exercise\": \"Write a simple 'Hello World' program with comments\"\n        },\n        {\n          \"title\": \"Variables and Data Types\",\n          \"content\": \"Working with integers, floats, strings, and booleans\",\n          \"exercise\": \"Create variables of different types and perform operations\"\n        }\n      ]\n    },\n    {\n      \"name\": \"Control Flow: Logic & Loops in Python\",\n      \"description\": \"Master the techniques to control program execution flow.\",\n      \"subtopics\": [\n        {\n          \"title\": \"Conditional Statements\",\n          \"content\": \"Using if, elif, and else for decision making\",\n          \"exercise\": \"Build a simple calculator with conditional logic\"\n        },\n        {\n          \"title\": \"Loops in Python\",\n          \"content\": \"Working with for and while loops for iteration\",\n          \"exercise\": \"Create a program that uses loops to generate patterns\"\n        }\n      ]\n    }\n  ]\n}\n```"},
      ],
    },
  ],
});