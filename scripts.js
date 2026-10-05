const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const copyBtn = document.getElementById("copyBtn");
const output = document.getElementById("output");

async function generateContent() {
    const type = document.getElementById("type").value;
    const topic = document.getElementById("topic").value.trim();
    const mood = document.getElementById("mood").value;
    const genre = document.getElementById("genre").value;

    if (!topic) {
        alert("Please enter a topic or idea.");
        return;
    }

    output.textContent = "✨ Generating with AI...";
    generateBtn.disabled = true;

    try {
        const response = await fetch("/.netlify/functions/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type,
                topic,
                mood,
                genre
            })
        });

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(text);
        }

        if (!response.ok) {
    throw new Error(
        data.error ||
        `Server error ${response.status}: ${text}`
    );
}

        output.textContent = data.result;

    } catch (error) {
        console.error(error);
        output.textContent = "Error: " + error.message;
    } finally {
        generateBtn.disabled = false;
    }
}

generateBtn.addEventListener("click", generateContent);

regenerateBtn.addEventListener("click", generateContent);

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(output.textContent);
        alert("Copied!");
    } catch {
        alert("Unable to copy.");
    }
});