'use client'

import { useState } from "react";

export default function Home() {

  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([])
  const [error, setError] = useState("");

  const mimiOption = [
    'Who won the latest chess game?',
    "Where does piza come from?",
    "Who do you know in Nigeria?"
  ]

  const mimi = () => {
    const randomValue = mimiOption[Math.floor(Math.random() * mimiOption.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question")
      return
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
      {
        role: "model",
        parts: data
      }
      ])
      setValue("")
    } catch (error) {
      console.log(error)
      setError("Something went wrong! please try again later")
    }
  }

  const clear = () => {
    setValue("")
    setError("")
    setChatHistory([])
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        <div>What do you want?</div>
        <button className="btn btn-blue" onClick={mimi} disabled={!chatHistory}>
          Click me
        </button>
        <div className="input-container">
          {/* <input
            value={value}
            placeholder="when is christmas"
            onChange={(e) => setValue(e.target.value)}
          /> */}
          <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Username
              </label>
              <input
                onChange={(e) => setValue(e.target.value)}
                value={value}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
            </div>
          </form>
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="">
          {chatHistory.map((chatItem, _index) => <div className="" key={_index}>
            <p>{chatItem.role} : {chatItem.parts}</p>
          </div>)}
        </div>
      </section>
    </main>
  );
}
