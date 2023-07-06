import { useState, useEffect } from 'react';

const App = () => {
  const [value, setValue] = useState(null);
  const [message, setMessage]  = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    };
  
    try {
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setMessage(data.choices[0].message);
      } else {
        setMessage(null);
      }
    } catch (error) {
      console.error(error);
    }
  };  

  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: value
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
      ]);
    }
  }, [message, currentTitle]);


  const currentChat = previousChats.filter(
    (previousChat) => previousChat.title === currentTitle
  );
  const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)));
  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="sidebar">

        <button onClick={createNewChat}>+ New Chat</button>

        <ul className="history"> 
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}</li>
              ))}
        </ul>

        <nav>
          <p>Made by Jen</p>
        </nav>

      </section>

      <section className="main">
        {!currentTitle && <h1>GPT</h1>}
        <ul className="feed">

          {currentChat?.map((chatMessage, index) => 
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          )}

        </ul>
        
        <div className="bottom">
          <div className="input">
            <input id="chatInput" value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>➢</div>
            <p className="info">hello</p>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App;
