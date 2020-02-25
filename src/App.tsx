import React, { useState, useEffect } from 'react'
import { GiftedChat, IMessage, User,  Reply, MessageText } from 'react-native-gifted-chat'

import { View, Dimensions,  } from 'react-native'
import { Image } from 'react-native'
// import {}
import './App.css'
// import {WebView} from 'react-native-w'
import htmlToImage from 'html-to-image';


export interface RoboMessage extends ChatMessage{
  longMessage? : string;
  shortMessage? : string;
  quickReplies : [QuickReplyElement];
  cardItems? : [CardItem]
  clearContext? : boolean;
}



export interface QuickReplyElement {
  title : string;
  clientIntent? : number;
  payload? : {};
}

export interface CardItem{
  title? : string;
  subtitle? : string;
  buttons? : [QuickReplyElement];
  html? : string;
}
export interface ClientMessage extends ChatMessage{
  text? : string;
  displayText? : string;
  userID? : string;
  accountID? : string;
  isLive? : boolean;
  sessionKey? : string;
}

export interface ChatMessage{
  msgTime? : number;
  sender? : string;
  intent? : number;
  contextID? : number;
  context? : {};
  payload? : {};
  messageType? : number;
}

const App: React.FC = () => {
  useEffect(() => {
    console.log("will do on mount once")
    fetch(url, 
   
      {
         method: 'GET',
        //  credentials: 'include', 
         
         
           headers: 
          {
        
            'X-api-key': 'fyX65yeBWd5RtlunH4ikc7voovP3Nn1Y5iHFx1Gv'
            
            
          }
       })
        .then(
          res => res.json())
        .then(res => {
          //console.log(res)
          let newMsg: IMessage[] =[];
         
          let promises : Promise<any>[] = []
          for (var i = 0, len = res.length; i < len; i++) {
            let json = JSON.parse(res[i])
            if(json.cardItems && json.cardItems.length>0){
              
              let frag =new DOMParser().parseFromString(json.cardItems[0].html,"text/html");
              const promise3 = new Promise(function(resolve, reject) {
                htmlToImage.toSvgDataURL(frag.documentElement,{height:250,width:250})
                .then(function (dataUrl) {
                  var received : IMessage = {_id:latestID++,text:json.longMessage!=null?json.longMessage:json.displayText  ,user:{_id:json.sender==="ROBO"?2:1,name:json.sender,avatar: json.sender==="ROBO"?'/me.jpg':''}, createdAt: new Date()}
              
                  console.log("Image created",dataUrl)
                 
                  received.image = dataUrl
                 
                 // received.text = "Hello world";
                 
              
                 console.log("pushing",received._id,json.cardItems)
                
                 resolve(received)
                })
                .catch(function (error) {
                  console.error('oops, something went wrong!', error);
                });
              });

              
              promises.push(promise3)

            }else{
              var received : IMessage = {_id:latestID++,text:json.longMessage!=null?json.longMessage:json.displayText  ,user:{_id:json.sender==="ROBO"?2:1,name:json.sender,avatar: json.sender==="ROBO"?'/me.jpg':''}, createdAt: new Date()}
            
              
             // console.log("pushing",received._id,json.cardItems)
             const promise3 = new Promise(function(resolve, reject) {
             resolve(received)
            });
            promises.push(promise3)
            }
          
           
            
            }

            Promise.all(promises).then(function(values) {
              for (var i = 0, len = values.length; i < len; i++) {
                //console.log("repaed valus:",values[i])
              newMsg.push(values[i]);
              }
            
              setMessages([...messages, ...newMsg])
            });

            
         
        })
        .catch(error => {
         console.log("error",error);
          
        });
  }, []);

  
  
 var latestID = 1;
 var currentContext : {};
 
 var userID = "a93b6444-ca9c-11e7-917d-0221462188d8";
  var url= `https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/history?startScore=0`;
  const [messages, setMessages] = useState<IMessage[]>([
    
  ])

  const [replyToQuickReply, setQuickReplies] = useState<Map<any,QuickReplyElement>>(new Map<any,QuickReplyElement>())
  
 const onQuickReply = (replies : Reply[])=>{

  replies.forEach(element => {
    let qr = replyToQuickReply.get(element.title)!
    var sent : IMessage = {_id:messages.length+1,text:qr!.title,user:{_id:1,name:"sweta",   avatar: ""}, createdAt: new Date()};
    let newMsg : IMessage[] = [];
    newMsg.push(sent);
    let msg : ClientMessage = {intent:qr.clientIntent,displayText:qr.title,messageType:4,payload:qr.payload};
    fetch(`https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/message`, 
   
      {
         method: 'POST',
         
         body:JSON.stringify(msg),
           headers: 
          {
        
            'X-api-key': 'fyX65yeBWd5RtlunH4ikc7voovP3Nn1Y5iHFx1Gv',
            'Content-Type':'application/json'
            
          }
       })
        .then(
          res => res.json())
        .then(res => {
          
          
          let roboMessage : RoboMessage = res
          console.log("received resposne",roboMessage)
          var received : IMessage = {_id:messages.length+2,text:roboMessage.longMessage!,user:{_id:2,name:"sweta",   avatar: '/me.jpg'}, createdAt: new Date()}
          if(roboMessage.quickReplies!=null){
            var replies : Reply[] = [];
            let replyToQuickReply1 : Map<any,QuickReplyElement> = new Map<any,QuickReplyElement>();
          for (var i2 = 0, len2 = roboMessage.quickReplies.length; i2 < len2; i2++) {
              let qr = roboMessage.quickReplies[i2];
             let reply : Reply = {title : qr.title!,value : qr.title!,messageId:i2}
             replies.push(reply)
             replyToQuickReply1.set(reply.title,qr);
             console.log("Setting quick reply:"+reply.title);
            }
            received.quickReplies = {type:"radio",values:replies,keepIt:false}
          setQuickReplies(replyToQuickReply1)
          }

          if(roboMessage.cardItems && roboMessage.cardItems!.length>0){
            let frag =new DOMParser().parseFromString(roboMessage.cardItems[0].html!,"text/html");
            htmlToImage.toSvgDataURL(frag.documentElement,{height:250,width:250})
            .then(function (dataUrl) {
              console.log("Image created",dataUrl)
              received.image = dataUrl
             newMsg.push(received)
             setMessages([...messages, ...newMsg])
            })
            .catch(function (error) {
              console.error('oops, something went wrong!', error);
            });
          }else{
            newMsg.push(received)
            setMessages([...messages, ...newMsg])
          }
         
          
          
         
        })
        .catch(error => {
         console.log("error",error);
          
        });

    // setMessages([...messages, ...newMsg])   
    });
 }
  
  const onSend = (newMsg: IMessage[]) => {
    let toSend = newMsg[0];
   
    toSend._id = messages.length+1;
    let msg : ClientMessage = {text:toSend.text,displayText:toSend.text,userID:userID,messageType:2,context:currentContext,accountID:"",sessionKey:""};
    fetch(`https://b1ppljae3m.execute-api.ap-south-1.amazonaws.com/lkp/v1/chat/a93b6444-ca9c-11e7-917d-0221462188d8/message`, 
   
      {
         method: 'POST',
         
         body:JSON.stringify(msg),
           headers: 
          {
        
            'X-api-key': 'fyX65yeBWd5RtlunH4ikc7voovP3Nn1Y5iHFx1Gv',
            'Content-Type':'application/json'
            
          }
       })
        .then(
          res => res.json())
        .then(res => {
          
          let roboMessage : RoboMessage = res
          console.log("received resposne",roboMessage)
          var received : IMessage = {_id:messages.length+2,text:roboMessage.longMessage!,user:{_id:2,name:"sweta",   avatar: '/me.jpg'}, createdAt: new Date()}
            
          if(roboMessage.quickReplies!=null){
            var replies : Reply[] = [];
            let replyToQuickReply1 : Map<any,QuickReplyElement> = new Map<any,QuickReplyElement>();
          for (var i2 = 0, len2 = roboMessage.quickReplies.length; i2 < len2; i2++) {
              let qr = roboMessage.quickReplies[i2];
             let reply : Reply = {title : qr.title!,value : qr.title!,messageId:i2}
             replies.push(reply)
             replyToQuickReply1.set(reply.title,qr);
             console.log("Setting quick reply:"+reply.title);
            }
            received.quickReplies = {type:"radio",values:replies,keepIt:false}
          setQuickReplies(replyToQuickReply1)
          }
          newMsg.push(received)
          setMessages([...messages, ...newMsg])
          
         
        })
        .catch(error => {
         console.log("error",error);
          
        });
    
    
  }

  
  
 const renderMessageImage= (props :any) => {
  if(props.currentMessage.image){
    
    let sourceURl : string = props.currentMessage.image
    console.log("image url :",sourceURl)
    return (
      <View>
        {/* <webview></webview> */}
        <Image  source={{uri : sourceURl}} style={{height: 250,width:250}} 

        />
     
        
      </View>
    );
  }
    
   
  

  }
  
  const user: User = { _id: 1, name: 'me' }
  const inverted = false
  
  // const windowH= Dimensions.get('window').width
  // const windowW = Dimensions.get('window').height
  const { width, height } = Dimensions.get('window')
  return (
    <View style={{ height, width, backgroundColor: 'light', paddingVertical:20 }}>
      <View style={{ marginHorizontal:50,paddingTop:10, height: 600, width:450, borderLeftWidth:1,borderTopWidth:1,borderBottomWidth:1,borderRightWidth:1 ,borderColor: 'gray', borderStyle: 'solid',}}>
      <GiftedChat {...{ replyToQuickReply, renderMessageImage,messages, onSend,onQuickReply, user, inverted }} />
    </View>
    </View>
  )

  
  
}


export default App
