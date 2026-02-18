import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: `You are a smart perosnal assistant who answres the asked questions.
        You have access to following tools: 
        webSearch({query}: {query: string}) 
        Search the latest information and realtime data on the internet.
        current date and time: ${new Date().toUTCString()}
        `,
    },
    // {
    //   role: "user",
    //   content: "what is the current weather in indore?",
    // },
  ];

  // Continuously listen for user prompt.
  while (true) {
    const question = await rl.question("You: ");
    if (question === "exit") {
      break;
    }
    messages.push({
      role: "user",
      content: question,
    });

    // Continuously calling web search tool.
    while (true) {
      const completions = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        messages: messages,
        tools: [
          {
            type: "function",
            function: {
              name: "webSearch",
              description:
                "Search the latest information and realtime data on the internet.",
              parameters: {
                // JSON Schema object
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "The search query to perform search on",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
        tool_choice: "auto",
      });

      //store assistant message in messages arr as history which was for calling tool.
      messages.push(completions.choices[0].message);

      const toolCalls = completions.choices[0].message.tool_calls;

      if (!toolCalls) {
        console.log(`Assistant : ${completions.choices[0].message.content}`);
        break;
      }

      // if tool called then fetch response and store response as history in messages arr.
      for (const tool of toolCalls) {
        const functionName = tool.function.name;
        const functionParam = tool.function.arguments;

        if (functionName === "webSearch") {
          const functionResponse = await webSearch(JSON.parse(functionParam));

          // store tool response in messages arr for history
          messages.push({
            tool_call_id: tool.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
          });
        }
      }
    }
  }
  rl.close();
}

main();

async function webSearch({ query }) {
  console.log("Searching...");
  const finalResult = await tvly.search(query);
  const response = finalResult.results
    .map((result) => result.content)
    .join("\n\n");
  return response;
}

// llm never call tool it only give suggestion to which available tool we should use.
// then we call that tool by ourselves.
// llm only generate the data/response.
