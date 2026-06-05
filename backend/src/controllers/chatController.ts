import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../models/todo';

// We need access to the in-memory store from todoController, 
// but since it's just a demo, we can import the add logic or export the array.
// For now, let's just require it or manage a simple export if we can.
// Actually, in todoController.ts, `todos` is let todos = []. It's not exported.
// Let's create a shared store or just redefine it here temporarily and we'll fix todoController later to export the array.
// In-memory data store
// We need access to the in-memory store from todoController, 
// but since it's just a demo, we can import the add logic or export the array.
// For now, let's just require it or manage a simple export if we can.
// Actually, in todoController.ts, `todos` is let todos = []. It's not exported.
// Let's create a shared store or just redefine it here temporarily and we'll fix todoController later to export the array.
import { todos } from './todoController';

// System prompt to instruct Gemini
const systemInstruction = `
You are a friendly and helpful assistant managing a TODO list. 
Your primary goal is to help the user create a new TODO task.
A task requires two fields: 'title' and 'message' (description).

When the user asks to create a task, check if both 'title' and 'message' are provided in their request or chat history.
If either is missing, politely ask the user for the missing information. Do NOT call the create_todo tool until you have both fields.
Once you have both the 'title' and the 'message', use the 'create_todo' tool to create the task, and inform the user that it has been created successfully.
Keep your responses concise and friendly.
`;

const createTodoTool = {
  name: "create_todo",
  description: "Creates a new TODO task with a title and a message.",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "The title of the TODO task.",
      },
      message: {
        type: "string",
        description: "The detailed message or description of the TODO task.",
      },
    },
    required: ["title", "message"],
  },
};

export const chatWithAi = async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
      tools: [{ functionDeclarations: [createTodoTool as any] }],
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    let aiText = "";
    let newTodo: Todo | null = null;

    // Check if the model called a function
    const functionCalls = response.functionCalls();
    console.log("functionCalls", functionCalls)
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === "create_todo") {
        console.log("call", call)
        const { title, message } = call.args as any;

        // Create the todo
        newTodo = {
          id: uuidv4(),
          title: title.trim(),
          message: message.trim(),
        };

        // Add to our store
        todos.push(newTodo);

        // The model expects a function response if it calls a function, but since we are handling this in a single turn for simplicity,
        // we can just return our own response text or ask the model to generate one.
        // Let's generate a final confirmation message from the model using the function response.
        const functionResponseResult = await chat.sendMessage([{
          functionResponse: {
            name: "create_todo",
            response: { success: true, todo: newTodo }
          }
        }]);

        aiText = functionResponseResult.response.text();
      }
    } else {
      aiText = response.text();
    }

    // Convert the updated history format for the frontend (which just expects role/parts or similar)
    const updatedHistory = await chat.getHistory();

    res.status(200).json({
      reply: aiText,
      newTodo: newTodo,
      history: updatedHistory
    });

  } catch (error) {
    console.error("Error in chatWithAi:", error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
};
