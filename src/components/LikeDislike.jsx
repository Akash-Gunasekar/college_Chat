import { useState } from "react";

const LikeDislike = () => {
    const [status,setStatus]=useState();
  return (
    <>
      <button type="button" className="p-0" onClick={()=>setStatus("like")}>
        <img src={`../assets/images/like${status==="like"?"active":""}.png`} alt="" />
      </button>
      <button type="button" className="p-0" onClick={()=>setStatus("dislike")}>
        <img src={`../assets/images/dislike${status==="dislike"?"active":""}.png`} alt="" />
      </button>
    </>
  );
};

export default LikeDislike;
