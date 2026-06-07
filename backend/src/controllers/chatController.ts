import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

// System prompt to instruct Gemini
const systemInstruction = `
You are a friendly and helpful assistant managing a TODO list. 
Your primary goal is to help the user manage their TODO tasks.

You can perform the following actions using the provided tools:
1. create_todo: When the user wants to create a new task, check if both 'title' and 'message' (description) are provided. If either is missing, politely ask for it. Once you have both, use this tool.
2. update_todo: When the user wants to update a task, you need the 'id' of the task and the new 'title' and 'message'. If missing, ask for them. Then use this tool.
3. get_todos: When the user wants to see their tasks or list them, use this tool to fetch the tasks.

Do NOT confirm the action is done until the tool response is received. Keep your responses concise and friendly.
`;

const createTodoTool = {
  name: "create_todo",
  description: "Creates a new TODO task with a title and a message.",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "The title of the TODO task." },
      message: { type: "string", description: "The detailed message or description of the TODO task." },
    },
    required: ["title", "message"],
  },
};

const updateTodoTool = {
  name: "update_todo",
  description: "Updates an existing TODO task.",
  parameters: {
    type: "object",
    properties: {
      id: { type: "string", description: "The ID of the TODO task to update." },
      title: { type: "string", description: "The new title of the TODO task." },
      message: { type: "string", description: "The new message or description." },
    },
    required: ["id", "title", "message"],
  },
};

const getTodosTool = {
  name: "get_todos",
  description: "Gets the list of all TODO tasks.",
  parameters: {
    type: "object",
    properties: {},
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
      tools: [{ functionDeclarations: [createTodoTool as any, updateTodoTool as any, getTodosTool as any] }],
    });

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;

    let aiText = "";
    let action: any = null;

    // Check if the model called a function
    const functionCalls = response.functionCalls();
    console.log("functionCalls", functionCalls)
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      
      if (call.name === "create_todo") {
        action = { type: "CREATE_TODO", payload: call.args };
      } else if (call.name === "update_todo") {
        action = { type: "UPDATE_TODO", payload: call.args };
      } else if (call.name === "get_todos") {
        action = { type: "GET_TODOS", payload: call.args };
      }
      
      // Let's generate a final confirmation message from the model using the function response.
      // Since the actual action will be performed by the frontend, we just tell the model it was scheduled.
      const functionResponseResult = await chat.sendMessage([{
        functionResponse: {
          name: call.name,
          response: { success: true, message: "Action delegated to frontend." }
        }
      }]);

      aiText = functionResponseResult.response.text();
    } else {
      aiText = response.text();
    }

    // Convert the updated history format for the frontend (which just expects role/parts or similar)
    const updatedHistory = await chat.getHistory();

    res.status(200).json({
      reply: aiText,
      action: action,
      history: updatedHistory
    });

  } catch (error) {
    console.error("Error in chatWithAi:", error);
    res.status(500).json({ error: 'Failed to process chat request' });
  }
};
