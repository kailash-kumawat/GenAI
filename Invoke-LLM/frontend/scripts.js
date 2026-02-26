const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");

const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
// 36 redix number -> 26(a-z) + 10(0-9)

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleClick);

const loading = document.createElement("div");
loading.textContent = "Thinking...";
loading.className = "my-6 animate-pulse";

// add messages to UI
async function generate(text) {
  // user message
  const msg = document.createElement("div");
  msg.className = "my-6 bg-neutral-800 rounded-2xl p-4 max-w-fit ml-auto";
  msg.textContent = text;
  chatContainer.append(msg);
  chatContainer.appendChild(loading);
  input.value = "";

  // call server
  const assistantMessage = await callServer(text);

  const assistantMsgElem = document.createElement("div");
  assistantMsgElem.className = "max-w-fit";
  assistantMsgElem.textContent = assistantMessage;

  loading.remove();

  chatContainer.append(assistantMsgElem);
}

async function callServer(inputText) {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({threadId: threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error("Error in generating the response");
  }

  const result = await response.json();
  return result.message;
}

// ask button
async function handleClick(e) {
  const text = input?.value;
  if (!text) {
    return;
  }
  await generate(text);
}

// enter key
async function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input?.value;
    if (!text) {
      return;
    }
    await generate(text);
  }
}
