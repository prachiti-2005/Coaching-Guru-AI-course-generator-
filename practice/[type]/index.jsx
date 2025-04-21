

import { View, Text, Image, Pressable, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { imageAssets, PracticeOption } from '../../../constant/Option';
import Colors from '../../../constant/Colors';
import { Ionicons } from '@expo/vector-icons';
import {db} from './../../../config/firebaseConfig';
import {query,collection,where, getDocs, orderBy} from '@firebase/firestore';
import {UserDetailContext} from './../../../context/UserDetailContext';
import CourseListGrid from '../../../components/PracticeScreen/CourseListGrid';

const PracticeTypeHomeScreen = () => {
  const {type} = useLocalSearchParams();
  const router = useRouter();
  const {userDetail} = useContext(UserDetailContext);
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState([]);

  const option = PracticeOption.find(item=>item.name == type);

  useEffect(() => {
    const fetchCourses = async () => {
      if (userDetail?.email) {
        try {
          const q = query(
            collection(db, 'Courses'),
            where('createdBy', '==', userDetail?.email),
            orderBy('createdOn','desc')
          );
          const querySnapshot = await getDocs(q);
          const courses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setCourseList(courses);
        } catch (e) {
          console.error("Error fetching courses: ", e);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCourses();
  }, [userDetail]);

  return (
    <View style={{flex: 1}}>
      <Image 
        source={option.image} 
        style={{
          height: 200,
          width: '100%',
        }}
      />
      <View style={{
        position: 'absolute',
        padding: 10,
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'
      }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons 
            name="arrow-back" 
            size={25} 
            color="black" 
            style={{
              backgroundColor: Colors.WHITE,
              padding: 8,
              borderRadius: 10
            }}
          />
        </Pressable>

        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 35,
          color: Colors.WHITE
        }}>{type}</Text>
      </View>

      {loading ? (
        <ActivityIndicator 
          size={'large'}
          style={{flex: 1}} 
          color={Colors.PRIMARY}
        />
      ) : (
        <CourseListGrid courseList={courseList}
        option={option} />
      )}
    </View>
  )
}

export default PracticeTypeHomeScreen;