import React, { useState, useEffect } from 'react'
import { GiftedChat, IMessage, User, Reply } from 'react-native-gifted-chat'
import { View, Dimensions } from 'react-native'
import './App.css'


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
          for (var i = 0, len = res.length; i < len; i++) {
            let json = JSON.parse(res[i])
            var received : IMessage = {_id:latestID++,text:json.longMessage!=null?json.longMessage:json.displayText  ,user:{_id:json.sender==="ROBO"?2:1,name:json.sender,avatar: json.sender==="ROBO"?'/me.jpg':''}, createdAt: new Date()}
            console.log("pushing",received)
            newMsg.push(received);
           
            
            }


            setMessages([...messages, ...newMsg])
         
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
          newMsg.push(received)
          setMessages([...messages, ...newMsg])
          
         
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


 
  const user: User = { _id: 1, name: 'me' }
  const inverted = false
  
  // const windowH= Dimensions.get('window').width
  // const windowW = Dimensions.get('window').height
  const { width, height } = Dimensions.get('window')
  return (
    <View style={{ height, width, backgroundColor: 'light', paddingVertical:20 }}>
      <View style={{ marginHorizontal:50,paddingTop:10, height: 500, width:400, borderLeftWidth:1,borderTopWidth:1,borderBottomWidth:1,borderRightWidth:1 ,borderColor: 'gray', borderStyle: 'solid',}}>
      <GiftedChat {...{ replyToQuickReply, messages, onSend,onQuickReply, user, inverted }} />
    </View>
    </View>
  )

  
  
}


export default App
