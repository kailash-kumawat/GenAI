const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleClick);

function generate(text) {
  const msg = document.createElement("div");
  msg.className = "my-6 bg-neutral-800 rounded-2xl p-4 max-w-fit ml-auto";
  msg.textContent = text;
  chatContainer.append(msg);
  input.value = "";
}

function handleClick(e) {
  const text = input?.value;
  if (!text) {
    return;
  }
  generate(text);
}

function handleEnter(e) {
  if (e.key === "Enter") {
    const text = input?.value;
    if (!text) {
      return;
    }
    generate(text);
  }
}
