import React, { useState } from 'react'
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat'
import { View, Dimensions } from 'react-native'
import './App.css'

const App: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([
    {
      _id: 123,
      text:
        'Hello Developer',
      user: {
        _id: 2,
        name: 'you',
        avatar: '/me.jpg',
      },
      createdAt: new Date(),
      quickReplies: {
        type: 'radio', // or 'checkbox',
        keepIt: true,
        values: [
          {
            title: 'no',
            value: 'yesno',
          },
          {
            title: 'Yes, let me show you with a picture!',
            value: 'yes_picture',
          },
          {
            title: 'Nope. What?',
            value: 'no',
          },
        ],
      },
    },
    
  ])
  const onSend = (newMsg: IMessage[]) => setMessages([...messages, ...newMsg])
  const user: User = { _id: 1, name: 'me' }
  const inverted = false
  // const windowH= Dimensions.get('window').width
  // const windowW = Dimensions.get('window').height
  const { width, height } = Dimensions.get('window')
  return (
    <View style={{ height, width, backgroundColor: 'light', paddingVertical:20 }}>
      <View style={{ marginHorizontal:50,paddingTop:10, height: 500, width:400, borderLeftWidth:1,borderTopWidth:1,borderBottomWidth:1,borderRightWidth:1 ,borderColor: 'gray', borderStyle: 'solid',}}>
      <GiftedChat {...{ messages, onSend, user, inverted }} />
    </View>
    </View>
  )
}

export default App
