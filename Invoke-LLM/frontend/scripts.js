const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleClick);

// add messages to UI
async function generate(text) {
  const msg = document.createElement("div");
  msg.className = "my-6 bg-neutral-800 rounded-2xl p-4 max-w-fit ml-auto";
  msg.textContent = text;
  chatContainer.append(msg);
  input.value = "";

  // call server
  const assistantMessage = await callServer(text);

  const assistantMsgElem = document.createElement("div");
  assistantMsgElem.className = "max-w-fit";
  assistantMsgElem.textContent = assistantMessage;
  chatContainer.append(assistantMsgElem);
}

async function callServer(inputText) {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: inputText }),
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
