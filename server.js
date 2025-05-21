require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.static('public'));
app.use(express.json());


const chatHistory = new Map();


const greetings = ['halo', 'hai', 'hi', 'hey', 'selamat pagi', 'selamat siang', 'selamat sore', 'selamat malam'];
const casualPhrases = ['apa kabar', 'gimana kabarnya', 'lagi apa', 'sedang apa'];


const greetingResponses = [
    "Hai! Selamat {timeOfDay}! Ada yang bisa saya bantu?",
    "Halo! Apa kabar? Ada yang bisa saya bantu hari ini?",
    "Hey! Senang bertemu dengan Anda. Ada yang bisa saya bantu?",
    "Hai! Semoga hari Anda menyenangkan. Ada yang bisa saya bantu?"
];




function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 11) return "pagi";
    if (hour < 15) return "siang";
    if (hour < 19) return "sore";
    return "malam";
}


function isCasualConversation(message) {
    const lowercaseMsg = message.toLowerCase().trim();
    return greetings.some(greeting => lowercaseMsg.includes(greeting)) ||
           casualPhrases.some(phrase => lowercaseMsg.includes(phrase));
}


function getRandomGreeting() {
    const greeting = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
    return greeting.replace('{timeOfDay}', getTimeOfDay());
}


app.post('/chat', async (req, res) => {
    try {
        const message = req.body.message;
        const sessionId = req.body.sessionId || 'default';

       
        if (!chatHistory.has(sessionId)) {
            chatHistory.set(sessionId, {
                pastUserInputs: [],
                generatedResponses: []
            });
        }

        const history = chatHistory.get(sessionId);

        if (isCasualConversation(message)) {
            const greeting = getRandomGreeting();
            history.pastUserInputs.push(message);
            history.generatedResponses.push(greeting);

            return res.json({
                text: greeting,
                from: 'bot'
            });
        }

       
        const systemPrompt = 'Kamu adalah asisten AI yang ramah dan santai, berbicara dalam Bahasa Indonesia. Jawab dengan jelas dan sopan, hindari jawaban panjang dan pengulangan, Jika user mengulang pertanyaan yang sama, beri variasi dalam jawaban.';

       
        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        for (let i = 0; i < history.pastUserInputs.length; i++) {
            messages.push({ role: 'user', content: history.pastUserInputs[i] });
            messages.push({ role: 'assistant', content: history.generatedResponses[i] });
        }

        
        messages.push({ role: 'user', content: message });

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'Chatbot Indonesia'
            },
            body: JSON.stringify({
                model: 'deepseek/deepseek-chat-v3-0324:free',
                messages,
                temperature: 0.7,
                max_tokens: 200,
                top_p: 0.9,
                frequency_penalty: 1.0,
                presence_penalty: 1.0
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Error dari OpenRouter');
        }

        const botResponse = data.choices[0].message.content.trim();

        history.pastUserInputs.push(message);
        history.generatedResponses.push(botResponse);

       
        if (history.pastUserInputs.length > 5) {
            history.pastUserInputs.shift();
            history.generatedResponses.shift();
        }

        res.json({
            text: botResponse,
            from: 'bot'
        });

    } catch (error) {
        console.error('Error:', error);
        const errorMessages = [
            "Maaf, sepertinya saya sedang berpikir terlalu keras. Bisa diulangi?",
            "Ups, ada sedikit gangguan. Bisa tanya lagi?",
            "Maaf, saya perlu waktu sebentar untuk memproses. Bisa diulangi pertanyaannya?"
        ];
        res.status(500).json({
            text: errorMessages[Math.floor(Math.random() * errorMessages.length)],
            from: 'bot'
        });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Pastikan Anda sudah menambahkan OPENROUTER_API_KEY di file .env');
}); 