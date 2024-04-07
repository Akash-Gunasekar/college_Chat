import { cloneElement, createContext, useContext, useEffect, useState } from "react"

const ChatFeatureContext=createContext();

const ChatFeature = ({children}) => {
    const [content,setContent]=useState("");
  return (
    <ChatFeatureContext.Provider value={{setContent,content}}>
        {children}
    </ChatFeatureContext.Provider>
  )
}

const Content=({children}) => {
  
  const {content,setContent}=useContext(ChatFeatureContext);
  useEffect(()=>{
        setContent(children[0]?.props?.children)
    },[children])

    return children
}

const CopyClipboard = ({children}) => {
  const {content}=useContext(ChatFeatureContext);
  const [isCopied,setIsCopied]=useState(false);
    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
      }
      
      const handleCopyClick = () => {
        copyTextToClipboard(content)
          .then(() => {
            setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
          })
          .catch((err) => {
            console.log(err);
          });
      }
  return (
    cloneElement(
        <div className="position-relative copy-text">
            {children}
            <span className={`position-absolute  fs-small-grey text-nowrap text-copy ${isCopied?"active":""}`}>Text copied</span>
        </div>
        ,{onClick: handleCopyClick })
  )
}

const DownloadText = ({children}) => {
  const {content}=useContext(ChatFeatureContext);
  const downloadTxtFile = () => {
      const element = document.createElement("a");
      element.classList.add("d-none")
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "myFile.txt";
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      element.remove();
    }
return (
   cloneElement(children,{onClick: downloadTxtFile })
)
}

const Speech = ({children}) => {
  const {content}=useContext(ChatFeatureContext);
  const speechFunc=()=>{
      let utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      utterance.ondata = function(event) {
          console.error('Speech synthesis error1:', event.error);
      };
      utterance.onerror = function(event) {
          console.error('Speech synthesis error:', event.error);
      };
      let r = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(r);
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 14000);
  }
return (
  cloneElement(children,{onClick: speechFunc })
)
}


ChatFeature.Content=Content
ChatFeature.CopyClipboard=CopyClipboard
ChatFeature.DownloadText=DownloadText
ChatFeature.Speech=Speech

export default ChatFeature