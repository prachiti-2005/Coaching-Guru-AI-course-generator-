import { View, Text, FlatList, StyleSheet, TouchableOpacity,Image } from 'react-native';
import React from 'react';
import Colors from './../../constant/Colors';
import {imageAssets} from './../../constant/Option';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';



const CourseList = ({ courseList }) => {
  
const route = useRouter();
  
// const  GetCourseById = async() => {
  //   const docRef = await getDoc(doc(db,'Courses',courseId));
  //   const courseData = docRef.data();
  // }

  return (
    <View style={{
      marginTop : 15
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize : 25
      }}>My Courses</Text>
      
      <FlatList
        data={courseList}
        horizontal = {true}
        showsHorizontalScrollIndicator = {false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
          onPress = {() => route.push({
            pathname : '/courseView',
            params : {
              courseParams : JSON.stringify(item)
            }
          })}
          style = {styles.courseContainer}>
            <Image source={imageAssets[item.banner_image]}
              style = {{
                width : '100%',
                height : 150,
                borderRadius : 15
              }}
            
            />
            <Text style={{
              fontFamily: 'outfit-bold',
              fontSize : 18,
              marginTop : 10
            }}>{item?.courseTitle}</Text>
            
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
              }}>
                {item?.chapters?.length} Chapters</Text>
            </View>
          </ TouchableOpacity>
    
        )} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  courseContainer : {
    padding : 10,
    backgroundColor : Colors.BG_GREY,
    margin : 6,
    borderRadius : 15,
    width : 260
  }
})


export default CourseList;

