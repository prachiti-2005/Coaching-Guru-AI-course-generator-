import { View, Text, FlatList, ScrollView } from 'react-native'
import React from 'react';
import Colors from './../../constant/Colors'
import { CourseCategory } from '../../constant/Option';
import CourseListBYCategory from '../../components/Explore/CourseListBYCategory';

const explore = () => {
  


  return (
    <ScrollView style={{
      padding : 25,
      backgroundColor : Colors.WHITE,
      flex : 1
    }}>
      <Text style={{
        fontFamily : 'outfit-bold',
        fontSize : 30,
      }}>Explore more courses</Text>

      
      {CourseCategory.map((item,index) => (
        <View key={index} style={{
          marginTop : 10
        }}>
          <Text style={{
            fontFamily : 'outfit-regular',
            fontSize : 20,
            
          }}>{item}</Text>
          <CourseListBYCategory category={item} />
        </View>
      ))}
     
    </ScrollView>
  )

}

export default explore