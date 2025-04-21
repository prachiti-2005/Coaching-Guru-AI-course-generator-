import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserDetailContext } from '../../context/UserDetailContext';
import { db } from '../../config/firebaseConfig';
import CourseProgressCard from '../../components/Shared/CourseProgressCard';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Colors from '../../constant/Colors';
import { useRouter } from 'expo-router';

const progress = () => {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const route = useRouter();

  useEffect(() => {
    if (userDetail?.email) {
      GetCourseList();
    }
  }, [userDetail]);

  const GetCourseList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const q = query(collection(db, 'Courses'), where("createdBy", '==', userDetail?.email));
      const querySnapshot = await getDocs(q);
      
      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setCourseList(courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to load courses. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View>
      <Image source={require('./../../assets/images/wave.png')} 
        style={{
          position: 'absolute',
          width: '100%',
          height: 500,
        }}
      />

      <View style={{
        width: '100%',
        position: 'absolute',
        padding: 20,
        marginTop : 20
      }}>
        <Text style={{
          fontFamily : 'outfit-bold',
          fontSize : 30,
          color : Colors.WHITE,
          marginBottom : 10
        }}>Course Progress</Text>
        <FlatList 
          data={courseList}
          showsVerticalScrollIndicator = {false}
          onRefresh= {() => GetCourseList()}
          refreshing = {loading}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress = {() => route.push({
              pathname : '/courseView',
              params : {
                courseParams : JSON.stringify(item)
              }
            })}>
              <CourseProgressCard item={item} width ={'97%'} />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}

export default progress