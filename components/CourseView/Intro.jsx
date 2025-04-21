import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { imageAssets } from '../../constant/Option'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'
import Button from './../../components/Shared/Button'
import { useRouter } from 'expo-router'

const Intro = ({course}) => {
  
  const router = useRouter();
  
    return (
    <View >

      <Image source={imageAssets[course?.banner_image]} 
        style={{
            width : '100%',
            height : 280
        }}
      />
      <View style={{
        padding : 20
      }}>
        <Text style={{
            fontFamily : 'outfit-bold',
            fontSize : 25,

        }}>{course?.courseTitle}</Text>
        <View style = {{
              display : 'flex',
              flexDirection : 'row',
              gap : 5,
              alignItems : 'center',
              marginTop : 5
            }}>
              <Ionicons name="book-outline" size={20} color="black" />
              <Text style={{
                fontFamily: 'outfit-regular',
                fontSize : 18
              }}>
                {course?.chapters?.length} Chapters</Text>
        </View>

        <Text style={{
            fontFamily : 'outfit-bold',
            fontSize : 20,
            marginTop : 10
        }}>Description : </Text>
      
      <Text 
      numberOfLines={2}
      style={{
        fontFamily : 'outfit-regular',
        fontSize : 18,
        color : Colors.GREY,
      }}>{course?.description}</Text>
      
      <Button text={'Start Now'}
        onPress={() => console.log('')}
      />

      </View>

      {/* back arrow */}
      <Pressable style={{
        position : 'absolute',
        padding : 10,
      }}
      onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={25} color="black" />
      </Pressable>


    </View>
  )
}

export default Intro