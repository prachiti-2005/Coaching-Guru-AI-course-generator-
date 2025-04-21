
import { View, Text, Image, FlatList } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { imageAssets } from '../../constant/Option';
import Intro from '../../components/CourseView/Intro';
import Colors from '../../constant/Colors';
import Chapters from '../../components/CourseView/Chapters';

const CourseView = () => {
  const { courseParams } = useLocalSearchParams();
  
  // Safely parse the course data
  
  let course;
  try {
    course = JSON.parse(courseParams);
  } catch (error) {
    console.error("Failed to parse course data:", error);
    return (
      <View>
        <Text>Error loading course data</Text>
      </View>
    );
  }

  return (
    
    <FlatList 
    data = {[]}
    ListHeaderComponent={
    <View style={{
            flex:1,
            backgroundColor : Colors.WHITE
    }}>
      <Intro course={course} />
      <Chapters  course={course}/>

    </View>
    }
    />


  );
}

export default CourseView;

