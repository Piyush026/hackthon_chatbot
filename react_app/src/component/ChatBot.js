import React, {useEffect, useState} from 'react';
import '../style.css'
import Cookies from "js-cookie";
const apiServer = `${process.env.REACT_APP_CONFIG_API_SERVER}`;


const ChatBot = () => {
    const [userInput, setUserInput] = useState('');
    const [data,setData] = useState("")
    const [responseData,setResponseData] = useState("")

    const submitValue = (e) => {
        e.preventDefault()
        setData(userInput)
        fetchData(userInput)
        console.log(data);
        setUserInput("")
    }
    const fetchData = async (val) => {
        const temp = Cookies.get("user_id")
        const industry = decodeURI(temp)
        console.log("industry",industry)
        const request_data = {
            "text":val,
            "industry": industry
        }
      const response = await fetch(apiServer + "/api/elastic_search/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(request_data),
        });
        // console.log("response",await response.json())
        setResponseData(await response.json())
    }
    console.log("responseData..",responseData)
    let slicedArray = ""
    if (responseData){
        if(!responseData.detail){
            slicedArray = responseData.slice(0, 3);
        }

    }
    console.log(slicedArray)
    return (
        <div>
            <div className="headerBar">
                <div className="user-photo">
                    <img src="images/bot.png" alt=""/>
                </div>
                <p className="title">Hey i'm Haunty</p>
            </div>
            <div className="chatbox">
                    <div className="chat friend">
                        <div className="user-photo"><img src="images/bot.png" alt=""/></div>
                        <p className="chat-message">Hello!</p>
                    </div>
                    <div className="chat friend" style={{ position: "absolute",right: "415px"}}>
                        <p className="chat-message">{data}</p>
                    </div>

                {slicedArray?slicedArray.map((data)=>{
                    return(
                        <div className="chat friend" key={data.id}>
                    <div className="user-photo"><img src="images/bot.png" alt=""/></div>
                    <div className="chat-message">
                        <p>name:{data.full_name}</p>
                        <p>email:{data.emails[0].address}</p>
                        <p>location:{data.location_region}</p>
                        <p>phone:{data.phone_numbers.toString()}</p>
                    </div>
                </div>
                    )
                }):null}
                {responseData.detail==="Error in elastic search"?    <div className="chat friend">
                    <div className="user-photo"><img src="images/bot.png" alt=""/></div>
                    <div className="chat-message">
                        <p>Data Not Found</p>
                    </div>
                </div>:null}
                {responseData && responseData.length>3?<a href={"/viewMore"}>View More</a>:null}

            </div>
            <div className="chat-form">
                <div id="inputDiv">
                    <div id="buttonDiv"/>
                    <textarea className="input" placeholder="enter name" onChange={e => setUserInput(e.target.value)}
                              rows="1" data-min-rows='1' value={userInput}/>
                </div>
                <div id="chat-form-buttons">
                    <button onClick={submitValue}>Submit</button>
                </div>
            </div>
        </div>

    )

}


export default ChatBot;