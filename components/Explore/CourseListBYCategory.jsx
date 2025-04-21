// import { View, Text, FlatList, Image } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import {query,collection, getDocs, doc, where, orderBy} from 'firebase/firestore';
// import {db} from './../../config/firebaseConfig';
// import { Ionicons } from '@expo/vector-icons';
// import Colors from '../../constant/Colors';
// import { StyleSheet } from 'react-native';
// import { imageAssets } from '../../constant/Option';

// const CourseListBYCategory = ({category}) => {

//     const [ courseList, setCourseList] = useState();
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         GetCourseListByCategory();
//     }, [category]) // Added empty dependency array to run only once

//     const GetCourseListByCategory = async () => {
//         setLoading(true);
//         setCourseList([]);
//         const q = query(
//             collection(db, 'Courses'),
//             where('category', '==', category),
//             orderBy('createdOn', 'desc')
//         ); // Fixed syntax errors in query construction

//         const querySnapshot = await getDocs(q);

//         querySnapshot?.forEach((doc) => {
//             console.log(doc.data());
//             setCourseList(prev => [...prev, doc.data()])
//         })
//         setLoading(false);
//     }

//   return (
//     <View>
//       <FlatList
//               data={courseList}
//               horizontal = {true}
//               showsHorizontalScrollIndicator = {false}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity 
//                 onPress = {() => route.push({
//                   pathname : '/courseView',
//                   params : {
//                     courseParams : JSON.stringify(item)
//                   }
//                 })}
//                 style = {styles.courseContainer}>
//                   <Image source={imageAssets[item.banner_image]}
//                     style = {{
//                       width : '100%',
//                       height : 150,
//                       borderRadius : 15
//                     }}
                  
//                   />
//                   <Text style={{
//                     fontFamily: 'outfit-bold',
//                     fontSize : 18,
//                     marginTop : 10
//                   }}>{item?.courseTitle}</Text>
                  
//                   <View style = {{
//                     display : 'flex',
//                     flexDirection : 'row',
//                     gap : 5,
//                     alignItems : 'center',
//                     marginTop : 5
//                   }}>
//                     <Ionicons name="book-outline" size={20} color="black" />
//                     <Text style={{
//                       fontFamily: 'outfit-regular',
//                     }}>
//                       {item?.chapters?.length} Chapters</Text>
//                   </View>
//                 </ TouchableOpacity>
          
//               )} 
//             />
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   courseContainer : {
//     padding : 10,
//     backgroundColor : Colors.BG_GREY,
//     margin : 6,
//     borderRadius : 15,
//     width : 260
//   }
// })

// export default CourseListBYCategory



import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from './../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { imageAssets } from '../../constant/Option';

const CourseListBYCategory = ({ category }) => {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        GetCourseListByCategory();
    }, [category])

    const GetCourseListByCategory = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, 'Courses'),
                where('category', '==', category)
            );

            const querySnapshot = await getDocs(q);
            const courses = [];
            
            querySnapshot.forEach((doc) => {
                courses.push({ id: doc.id, ...doc.data() });
            });

            courses.sort((a, b) => b.createdOn - a.createdOn);
            setCourseList(courses);
        } catch (error) {
            console.error("Error fetching courses: ", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View>
            <FlatList
                data={courseList}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => router.push({
                            pathname: '/courseView',
                            params: {
                                courseParams: JSON.stringify(item)
                            }
                        })}
                        style={styles.courseContainer}
                    >
                        <Image source={imageAssets[item.banner_image]}
                            style={{
                                width: '100%',
                                height: 150,
                                borderRadius: 15
                            }}
                        />
                        <Text style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 18,
                            marginTop: 10
                        }}>{item?.courseTitle}</Text>
                        
                        <View style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 5,
                            alignItems: 'center',
                            marginTop: 5
                        }}>
                            <Ionicons name="book-outline" size={20} color="black" />
                            <Text style={{ fontFamily: 'outfit-regular' }}>
                                {item?.chapters?.length} Chapters
                            </Text>
                        </View>
                    </TouchableOpacity>
                )} 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    courseContainer: {
        padding: 10,
        backgroundColor: Colors.BG_GREY,
        margin: 6,
        borderRadius: 15,
        width: 260
    }
})

export default CourseListBYCategory