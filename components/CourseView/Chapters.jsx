import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../constant/Colors'
import { useRouter } from 'expo-router'

const Chapters = ({course}) => {
  const router = useRouter();

  console.log("Course data received:", {
    id: course?.id,
    chaptersCount: course?.chapters?.length,
    completedChapters: course?.completedChapter
  });

 
  const isChapterCompleted = (index) => {
    // Convert completedChapter to array if it isn't one
    let completedChapters = [];
    if (course?.completedChapter) {
      completedChapters = Array.isArray(course.completedChapter) 
        ? course.completedChapter 
        : [course.completedChapter];
    }
    
    // Convert all elements to numbers and filter out any NaN values
    completedChapters = completedChapters
      .map(item => Number(item))
      .filter(item => !isNaN(item));
  
    const isCompleted = completedChapters.includes(Number(index));
    console.log(`Chapter ${index} completed status:`, isCompleted, completedChapters);
    return isCompleted;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontFamily: 'outfit-bold', fontSize: 25 }}>Chapters</Text>

      <FlatList
        data={course?.chapters}
        renderItem={({item, index}) => {
          const completed = isChapterCompleted(index);
          return (
            <TouchableOpacity 
              onPress={() => {
                console.log("Navigating to chapter:", index);
                router.push({
                  pathname: '/chapterView',
                  params: {
                    chapterParams: JSON.stringify(item),
                    docId: course.id,
                    chapterIndex: index
                  }
                });
              }}
              style={{
                padding: 18,
                borderWidth: 0.5,
                borderRadius: 15,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: completed ? Colors.LIGHT_PRIMARY : Colors.WHITE
              }}
            >
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={styles.chapterText}>{index+1}.</Text>
                <Text style={styles.chapterText}>{item.chapterName}</Text>
              </View>
              {completed ? (
                <Ionicons name="checkmark-circle" size={24} color={Colors.PRIMARY} />
              ) : (
                <Ionicons name="play-circle-outline" size={24} color={Colors.PRIMARY} />
              )}
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    chapterText: {
        fontFamily: 'outfit-regular',
        fontSize: 20
    }
})

export default Chapters