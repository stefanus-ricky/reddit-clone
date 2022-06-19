import React, {useState, useEffect} from 'react'
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'


export default function Consent() {
  const [loading, setLoading] = useState(true)
  const [url, setUrl] = useState("")
  
  let navigate = useNavigate();

  let token, err;
  useEffect ( ()=>{
    fetchInitialData();
    // Probably better doing this from backend
    // getAccessTokenFromCode("")
    return ()=>{
      setUrl("")
    }

  },[])

  async function fetchInitialData () {
    const baseURL = "http://localhost:55050";
    let apiAddress = baseURL + "/user/url"
    axios(apiAddress, {
      method: "GET",
    }).then(res=>{
      setUrl(res.data)
      setLoading(false)
    })
  }


  if(loading) return (
    <div>Loading...</div>
  )
  return (
    <div style={{display:"flex", flexDirection:'column', justifyContent:"center", height:"100vh", alignItems:"center"}}>
      <div>Your link is ready</div>
      <a className='flex btn-lg btn-primary m-3' style ={{textDecoration: 'none'}} href={url} >
      Click here to proceed
      </a>

      <a href="https://google.com" target="_blank" rel="noreferrer">
          Google.com
      </a>

    </div>
  )
  // )
}

async function getAccessTokenFromCode(code) {
  let bodyParams = new URLSearchParams({
      grant_type:"authorization_code",
      code: code,
      redirect_uri: "http://localhost:55050/redirect-uri",
    });
    const requestAddress = "https://www.reddit.com/api/v1/access_token"
    console.log(process.env.REACT_APP_REDDIT_ID )
    console.log(process.env.REACT_APP_REDDIT_SECRET)
    // const auth = 'Basic ' + Buffer.from(process.env.REACT_APP_REDDIT_ID + ':' + process.env.REACT_APP_REDDIT_SECRET).toString('base64') //
    const auth = process.env.REACT_APP_BASIC_AUTH
    console.log({code, auth})
  
    
    try{
      const response = await axios({
        url: requestAddress,
        method: "POST",
        headers: {
            // "Content-Type": 'application/json',
            // "Accept": 'application/json',
            // "Content-Type": 'application/x-www-form-urlencoded',
            "Authorization": auth,
            
            // 'User-Agent': 'FilterForReddit /2.0 by Quarrantine',
        },
        data: bodyParams
      })
      console.log({response})
      // console.log({data:response.data})
      return [response, null]
    } catch(err) {
      console.error(err)
      return [null, err]
    }
  
  }