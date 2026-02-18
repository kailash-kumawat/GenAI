import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 1,
    // top_p: 0.2,
    // stop: "BE",
    // max_completion_tokens: 1000,
    // frequency_penalty: 2,
    // presence_penalty: 2,
    messages: [
      {
        role: "system",
        content:
          "Extract product review information from the text. give output in JSON object format.",
      },
      {
        role: "user",
        content:
          "I bought the UltraSound Headphones last week and I'm really impressed! The noise cancellation is amazing and the battery lasts all day. Sound quality is crisp and clear. I'd give it 4.5 out of 5 stars.",
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  console.log(JSON.parse(response.choices[0].message.content));
}

main();

// NOTE: temp and top_p both are alternatives, temp range(0-2, creativeness increases towards 2) and top_p range(0-1)
// Use any one

// stop use to stop the LLM generation on the given value.

// max compl token use to restrict token completion.

/* difference between frequency and presence penalty is that 
frequency penalty penalizes tokens based on their existing frequency in the text, 
while presence penalty penalizes tokens based on whether they have appeared at all in the text. 
Frequency Penalty = “Stop repeating too much.”
Presence Penalty = “Try something new.”
*/

/* response_format: {type: "json_object",} + in system content mention 'json output' gives 
json data */

// use ZOD to validate response
// instructor lib use to pre validate the given output is according to the schema. without this we manually need to check.

/* STEPS TO GET STRUCTURED JSON OUTPUT:
1. By system prompt manually
2. By using reponse format + system prompt both required
3. reposne type: json object almost every LLM support, json schema in which we define our schema 100% accuracy but not every LLM support.
*/
