import React, { useRef, useState } from 'react'
import './chatbot.css'
import data from "../data.json"
import { IoIosSend } from "react-icons/io";


const Chatbot = () => {
    const [response, setResponse] = useState('')
    const [prompt, setPrompt] = useState("")
    const [isResponding, setIsResponding] = useState(false)
    const msgContainerRef = useRef()
    const api = 'https://3bfd-34-142-169-70.ngrok-free.app/'
    const sendPrompt = async () => {
        if (prompt) {
            const messagesContainer = msgContainerRef.current;
            setIsResponding(true);

            // Assuming "prompt" is your state variable holding the current input
            const userMessage = prompt;
            setPrompt(''); // Clear input

            // Create and display the user's message
            const userPromptDiv = document.createElement('div');
            userPromptDiv.className = "userPrompt";
            userPromptDiv.appendChild(document.createTextNode(userMessage));
            messagesContainer.appendChild(userPromptDiv);

            // Create a container for the chatbot's response
            const chatbotResponseDiv = document.createElement('div');
            chatbotResponseDiv.className = "chatbotResponse";
            messagesContainer.appendChild(chatbotResponseDiv);

            try {
                // Make the POST request to your endpoint
                const response = await fetch(api + 'promptt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ prompt: userMessage })
                });

                const data = await response.json();
                console.log('Response from server:', data);

                // Save the complete generated text to state (if needed)
                setResponse(data.generated_text.replace(/\n/g, "<br/>"));

                // Split the generated text into words
                let splitResponse = data.generated_text.split(" ");

                // Display the generated text word-by-word with a fade-in effect
                splitResponse.forEach((word, index) => {
                    setTimeout(() => {
                        const wordSpan = document.createElement('span');
                        wordSpan.textContent = word + " ";
                        wordSpan.classList.add("fade-in");
                        chatbotResponseDiv.appendChild(wordSpan);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;

                        // When the last word is added, update the responding state
                        if (index === splitResponse.length - 1) {
                            setTimeout(() => setIsResponding(false), 100);
                        }
                    }, index * 40);
                });
            } catch (error) {
                console.error('Error:', error);
                setIsResponding(false);
            }
        }
    };


    return (
        <main className='main'>
            <section className='chatbot_section'>
                <h2>MedBot🤖</h2>
                <h4>Your AI Medical Consultant 😷</h4>
                <div className='messagesContainer' ref={msgContainerRef}></div>
                <div className="input_container">
                    <input value={prompt} onChange={(e) => { setPrompt(e.target.value) }} type="text" name="user_prompt" id="user_prompt" placeholder='Ask anything' />
                    <button disabled={isResponding} onClick={sendPrompt} className='submit_button'><IoIosSend size={24} /></button>

                </div>
            </section>
        </main>
    )
}

export default Chatbot