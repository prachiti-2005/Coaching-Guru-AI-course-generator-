import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from './../../constant/Colors'
import { Ionicons } from '@expo/vector-icons'

const QuestionAnswers = () => {
  
  const {courseParams} = useLocalSearchParams();
  const course = JSON.parse(courseParams);
  const qaList = course?.qa;
  const [selectedQuestion, setSelectedQuestion] = useState();
  const router = useRouter();
  
  const onQuestionSelect = (index) => {
    if(selectedQuestion == index){
        setSelectedQuestion(null);
    }else{
        setSelectedQuestion(index);
    }
  }
    return (
    <View>
      <Image source = {require('./../../assets/images/wave.png')} 
      style={{
        height : 800,
        width : '100%'
      }} />

      <View style={{
        position : 'absolute',
        width : '100%',
        padding : 20,
        marginTop : 35
      }}>

      <View style={{
        display : 'flex',
        flexDirection : 'row',
        gap : 7,
        alignItems : 'center'
        }}>
        <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
        </Pressable>


        <Text style={{
            fontFamily : 'outfit-bold',
            fontSize : 28,
            color : Colors.WHITE
        }}>Question & Answers</Text>
       </View>

        <Text style={{
            fontFamily : 'outfit-regular',
            color : Colors.WHITE,
            fontSize : 20
        }}>{course?.courseTitle}</Text>

        <FlatList  
        data={qaList}
        renderItem = {({item,index}) => (
            <Pressable style={styles.card}
            onPress={() => onQuestionSelect(index)}
            >
                <Text style={{
                    fontFamily : 'outfit-bold',
                    fontSize : 20
                }}>{item?.question}</Text>

                {selectedQuestion == index && 
                <View style={{
                    borderTopWidth : 0.4,
                    marginVertical : 10,
                }}>
                    <Text style={{
                        fontFamily : 'outfit-regular',
                        fontSize : 17,
                        color : Colors.PRIMARY,
                        marginTop : 10
                    }}> Answer : {item?.answer}</Text>
                </View>
                }
                
            </Pressable>
        )}
        />


      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    card : {
        padding : 20,
        backgroundColor :Colors.WHITE,
        marginTop : 15,
        borderRadius : 15,
        elevation : 1
    }
})

export default QuestionAnswers