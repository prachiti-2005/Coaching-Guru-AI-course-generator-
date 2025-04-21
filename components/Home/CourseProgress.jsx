import { View, Text, FlatList, Image } from 'react-native';
import React from 'react';
import Colors from '../../constant/Colors';
import CourseProgressCard from '../Shared/CourseProgressCard';

const CourseProgress = ({ courseList }) => {
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 25,
        color: Colors.WHITE
      }}>Progress</Text>

      <FlatList
        data={courseList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CourseProgressCard item={item} />
        )}
      />
    </View>
  );
}

export default CourseProgress;

