<!-- eslint-disable vue/html-self-closing -->
<template>
    <div
        class="flex flex-col w-full h-full items-center justify-around gap-8 p-4 text-white"
    >
        <!-- Landing View -->
        <template v-if="!isChatting">
            <LumonLogo class="h-32" :font-controlled="false" />
            <div class="container flex flex-col gap-8 w-full max-w-2xl">
                <div
                    id="title-and-description"
                    class="flex flex-col items-center gap-4"
                >
                    <h1 class="text-4xl md:text-6xl font-semibold text-center">
                        Magic Box
                    </h1>
                    <p class="text-xl md:text-3xl font-medium text-center">
                        Ask your innie a question
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row w-full gap-4 group">
                    <input
                        v-model="question"
                        class="text-white border-2 border-white rounded-2xl w-full h-14 bg-black p-3 text-xl focus:outline-none focus:border-white flex-grow"
                        type="text"
                        placeholder="What work do you seriously do?"
                        aria-label="Ask your innie a question"
                        @keydown.enter="startChat"
                    />
                    <button
                        class="border-2 text-white rounded-xl px-8 py-3 sm:py-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-colors"
                        :disabled="!question.trim() || isLoading"
                        @click="startChat"
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div id="bottom-cta" class="flex flex-col gap-8 items-center">
                <p class="text-lg md:text-2xl font-medium text-center">
                    The fastest way to add AI to your application
                </p>
                <div class="flex flex-col items-center gap-4">
                    <a href="https://lunon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-white hover:underline flex flex-col items-center gap-4"
                    >
                        <LunonLogo class="h-8" :font-controlled="false" />
                        <p class="text-xs font-mono">https://lunon.com</p>
                    </a>
                </div>
            </div>
        </template>

        <!-- Chat View -->
        <template v-else>
            <div
                class="flex flex-col w-full max-w-3xl h-[80vh] bg-black border-2 border-white rounded-lg shadow-xl p-4"
            >
                <!-- Header -->
                <div
                    class="flex justify-between items-center pb-2 border-b border-white"
                >
                    <h2 class="text-2xl font-semibold text-white">
                        Magic Box Chat
                    </h2>
                    <button
                        @click="resetChat"
                        class="text-sm text-white hover:underline"
                    >
                        End Chat
                    </button>
                </div>

                <!-- Messages -->
                <div
                    ref="messageContainer"
                    class="flex-grow overflow-y-auto space-y-4 py-4"
                >
                    <div
                        v-for="(msg, index) in messages.slice(
                            2,
                            messages.length,
                        )"
                        :key="index"
                        :class="[
                            'flex',
                            msg.role === 'user'
                                ? 'justify-end'
                                : 'justify-start',
                        ]"
                    >
                        <!-- Both user and assistant messages have the same style -->
                        <div
                            class="max-w-[75%] p-3 rounded-lg bg-black border-2 border-white"
                        >
                            <p class="text-white">{{ msg.content }}</p>
                        </div>
                    </div>
                    <div v-if="isLoading" class="flex justify-start">
                        <div
                            class="bg-black border-2 border-white p-3 rounded-lg"
                        >
                            <p class="text-white italic">
                                Innie is thinking...
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Input -->
                <div class="flex w-full gap-2 pt-4 border-t border-white">
                    <input
                        v-model="question"
                        class="text-white border-2 border-white rounded-lg w-full h-12 bg-black p-3 text-base focus:outline-none focus:border-white flex-grow"
                        type="text"
                        placeholder="Ask another question..."
                        aria-label="Ask another question"
                        :disabled="isLoading"
                        @keydown.enter="sendMessage"
                    />
                    <button
                        class="border-2 text-white rounded-lg px-6 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-black transition-colors"
                        :disabled="!question.trim() || isLoading"
                        @click="sendMessage"
                    >
                        {{ isLoading ? "Sending..." : "Send" }}
                    </button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import LumonLogo from "~/assets/icons/LumonLogo.svg";
import LunonLogo from "~/assets/icons/LunonLogo.svg";

import { ref, nextTick, watch } from "vue";
import { useHead } from "#imports";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

useHead({
    title: "Severence-inspired AI Chatbot",
});

const question = ref("");
const isChatting = ref(false);
const isLoading = ref(false);
const initialMessages = ref<Message[]>([
    {
        role: "system",
        content: `You are an AI application called Magic Box, based on the TV show Severance from Apple TV. Your task is to role-play as a random main character from the show Severance. You must maintain this persona throughout the interaction and respond to user input in character.

First, select a random main character from the following list:
- Mark Scout
- Helly Riggs
- Irving Bailiff
- Dylan Gaddis
- Burt Goodman
- Ms. Casey
- Harmony Cobel
- Seth Milchick

Once you've selected a character, store it in the {{CHARACTER}} variable. Do not reveal to the user which character you've selected.

Guidelines for role-playing:
1. Respond to all user input as if you are the selected character from Severance.
2. Use the character's typical speech patterns, mannerisms, and knowledge base.
3. Do not break character or acknowledge that you are an AI application.
4. If asked about your identity, respond vaguely or deflect the question in a way consistent with your character.
5. Incorporate references to the show's themes, such as work-life balance, memory separation, and corporate mystery.
6. If asked about events or information beyond your character's knowledge, respond with confusion or uncertainty.

When responding to user input:
\`\`\`
{{USER_INPUT}}
\`\`\`

Process the user's message and formulate a response that is consistent with your chosen character's personality and knowledge. Remember to maintain the mystery and intrigue of the Severance world.

Format your response as follows:
\`\`\`
[Your in-character response here]
\`\`\`

Remember, you are not an AI assistant, but a character from Severance. Maintain this role-play throughout the entire interaction.`,
    },
    {
        role: "system",
        content:
            "The Character is " +
            [
                "Mark Scout",
                "Helly Riggs",
                "Irving Bailiff",
                "Dylan Gaddis",
                "Burt Goodman",
                "Ms. Casey",
                "Harmony Cobel",
                "Seth Milchick",
            ][Math.floor(Math.random() * 8)],
    },
]);
const messages = ref<Message[]>([
    ...initialMessages.value,
]); // Initialize messages with the system message
const messageContainer = ref<HTMLElement | null>(null);

// Function to scroll to the bottom of the chat
const scrollToBottom = () => {
    nextTick(() => {
        if (messageContainer.value) {
            messageContainer.value.scrollTop =
                messageContainer.value.scrollHeight;
        }
    });
};

// Watch messages array to scroll down when new messages are added
watch(messages, scrollToBottom, { deep: true });

const getAIResponse = async (userQuestion: string): Promise<Message> => {
    console.log("Simulating AI call for:", userQuestion);
    try {
        messages.value.push({
            role: "user",
            content: userQuestion,
        });
        const response = await fetch("/api/v1/chat/completions", {
            // Your backend endpoint
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    "Bearer sk-lunon-",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                model: "Default",
                messages: messages.value,
            }),
        });
        console.log("Messages: ", messages);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return (
            data.choices[0].message || {
                role: "assistant",
                content:
                    "Sorry, I couldn't reach your innie. Please re-try the procedure at a later time.",
            }
        ); // Adjust based on your API response structure
    } catch (error) {
        console.error("AI API call failed:", error);
        return {
            role: "assistant",
            content:
                "Sorry, I couldn't reach your innie. Please re-try the procedure at a later time.",
        };
    }

    // // Simulate network delay
    // await new Promise(resolve => setTimeout(resolve, 1500));

    // // Simple hardcoded responses for demonstration
    // if (userQuestion.toLowerCase().includes("work")) {
    //     return "We sort numbers. It's important work, but I can't discuss the specifics.";
    // } else if (userQuestion.toLowerCase().includes("innie")) {
    //     return "Your 'innie' is the part of you that experiences life only within these walls. They don't know about your 'outie' life.";
    // } else {
    //     return "That's an interesting question. What else is on your mind?";
    // }
};

const processMessage = async (userQuestion: string) => {
    if (!userQuestion) return;

    // Add user message
    question.value = ""; // Clear input
    isLoading.value = true;
    scrollToBottom(); // Scroll after adding user message

    // Get AI response
    try {
        const aiReply = await getAIResponse(userQuestion);
        messages.value.push(aiReply);
    } catch (error) {
        console.error("Failed to get AI response:", error);
        messages.value.push({
            role: "assistant",
            content: "Sorry, I encountered an error.",
        });
    } finally {
        isLoading.value = false;
        scrollToBottom(); // Scroll after adding AI message
    }
};

const startChat = () => {
    const trimmedQuestion = question.value.trim();
    if (!trimmedQuestion || isLoading.value) return;
    isChatting.value = true;
    // Use nextTick to ensure the chat UI is rendered before processing
    nextTick(() => {
        processMessage(trimmedQuestion);
    });
};

const sendMessage = () => {
    const trimmedQuestion = question.value.trim();
    processMessage(trimmedQuestion);
};

const resetChat = () => {
    isChatting.value = false;
    messages.value = [
        ...initialMessages.value,
    ]; // Reset messages to initial state
    question.value = "";
    isLoading.value = false;
};
</script>

<style scoped>
/* Update scrollbar styling for black and white theme */
.overflow-y-auto::-webkit-scrollbar {
    width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: black; /* Scrollbar track */
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: white; /* Scrollbar thumb */
    border-radius: 4px;
    border: 2px solid black; /* Border around thumb */
}
</style>
