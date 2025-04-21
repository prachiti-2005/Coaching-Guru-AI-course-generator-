import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors'
import { ActivityIndicator } from 'react-native-web'


// button file to add buttons to any pages
const Button = ({text,type="fill",onPress,loading}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{
        padding : 15,
        width : '100%',
        borderRadius:15,
        marginTop : 15,
        borderWidth : 1,
        borderColor : Colors.PRIMARY,
        backgroundColor : type == 'fill'?Colors.PRIMARY : Colors.WHITE
    }}
    disabled = {loading}
    >
      {!loading ?<Text style={{
        textAlign : 'center',
        fontSize :18,
        color : type == 'fill'?Colors.WHITE : Colors.PRIMARY
      }}>{text}</Text>:
      <ActivityIndicator size={'small'} color={type === 'fill' ? Colors.WHITE : Colors.PRIMARY} />      }
    
    </TouchableOpacity>
  )
}

export default Button