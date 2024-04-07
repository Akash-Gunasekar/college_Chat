import { useEffect, useRef, useState } from "react";
import ChatFeature from "./components/ChatFeature";
import LikeDislike from "./components/LikeDislike";
import ChipCon from "./components/ChipCon";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";

function App() {
  const baseURL='http://127.0.0.1:5001/query';
  const [userChatType, setUserChatType] = useState("");
  const [chat, setChat] = useState([
    { youSend: true, msg: "show  templates for payment transaction failure" },
    {
      youSend: false,
      msg: "Select the transaction type for which you need the template",
    },
  ]);
  const chatRef = useRef();
  const [defineChat, setDefineChat] = useState("");
  const [preview, setPreview] = useState("");
  const handleChatResponse = async (value) => {
    try {
      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ randomQuery: value }), // Assuming query is the variable containing the input message
      });

      if (!response.ok) {
        throw new Error("Failed to get smart response");
      }

      // Get the response text
      const data = await response.text();
      console.log(data);
      setChat([
        ...chat,
        {
          youSend: true,
          msg: value,
          img: preview,
        },
        {
          youSend: false,
          msg: data,
        },
      ]);
      setUserChatType("");

      setDefineChat("");
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const chatSubmit = (e) => {
    e.preventDefault();
    setChat([
      ...chat,
      {
        youSend: true,
        msg: userChatType,
        img: preview,
      },
    ]);
    handleChatResponse(userChatType);
    setUserChatType("");
    chatRef.current.focus();
    setPreview("");
  };
  const imageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPreview(reader.result);
      }
    };
    if (e.target?.files) {
      reader.readAsDataURL(e.target.files?.[0]);
    }
  };
  useEffect(()=>{
    if(defineChat.length>0){
      setChat([...chat,{
        youSend: true,
        msg: defineChat,
      } ])   
      handleChatResponse(defineChat)
      
    }
  },[defineChat]);
  return (
    <div className={`d-flex flex-column main-con p-5 pb-0`}>
      <div className="flex-grow-1 chat-con d-flex flex-column ">
        <p className="fs-topic-medium text-uppercase topic mb-4">Chat</p>
        <p className="fs-medium text-center grey-text">Today,3:45pm </p>
        <ul className="flex-grow-1 ">
          {chat.map((item, idx) => {
            return (
              <ChatFeature key={idx}>
                <li className={item.youSend ? "active" : ""}>
                  <div className={`sub-con d-flex align-items-start gap-3 $`}>
                    <img
                      src={`assets/images/${
                        item.youSend ? "profile" : "chatprofile"
                      }.png`}
                      className="user-img"
                      alt=""
                    />
                    <div className="fs-regular d-flex flex-column gap-2">
                      <ChatFeature.Content>
                        {item.msg && <div className="msg-text">{item.msg}</div>}
                        {item.img && (
                          <div className="img-preview">
                            <img src={item.img} alt="" />
                          </div>
                        )}
                      </ChatFeature.Content>
                      <div className="d-flex align-items-center gap-3 cop-img-con ">
                        <LikeDislike />
                        <ChatFeature.CopyClipboard>
                          <button type="button" className="p-0">
                            <img src={"assets/images/copy-1.png"} alt="" />
                          </button>
                        </ChatFeature.CopyClipboard>
                        <ChatFeature.DownloadText>
                          <button type="button" className="p-0">
                            <img src={"assets/images/dwnload.png"} alt="" />
                          </button>
                        </ChatFeature.DownloadText>
                        <ChatFeature.Speech>
                          <button type="button" className="p-0">
                            <img src={"assets/images/audio.png"} alt="" />
                          </button>
                        </ChatFeature.Speech>
                      </div>
                      {!item.youSend && idx + 1 === chat.length ? (
                        <div className="chat-chip">
                          <ChipCon
                            value={[
                              "Insufficient Funds",
                              "Incorrect Payment Information",
                              "Customer Account Flagged",
                              "Invalid Payee Account",
                              "Authentication Failure",
                            ]}
                            setAction={setDefineChat}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </li>
              </ChatFeature>
            );
          })}
        </ul>
      </div>
      <div className="footer-con chat-tab-footer">
        {preview && (
          <div className="image-preview">
            <img src={preview} alt="" />
          </div>
        )}
        <form
          className="bottom-con d-flex align-items-center gap-3"
          onSubmit={(e) => {
            chatSubmit(e);
          }}
        >
          <label htmlFor="img-upload">
            <input
              type="file"
              id="img-upload"
              className="d-none"
              accept="image/*"
              onChange={imageUpload}
            />
            <img
              src={"assets/images/addimage.png"}
              alt=""
              className="upload-icon"
            />
          </label>
          <button type="button" className="fs-medium">
            <img
              src="assets/images/microphone.png"
              alt=""
              className="mic-icon"
            />
          </button>
          <input
            type="text"
            className="fs-topic-primary-regular flex-grow-1"
            placeholder="Enter your prompt"
            value={userChatType}
            ref={chatRef}
            onChange={(e) => setUserChatType(e.target.value)}
          />
          <button type="submit">
            <img
              src={"assets/images/send.png"}
              alt=""
              className="send-icon"
            />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
