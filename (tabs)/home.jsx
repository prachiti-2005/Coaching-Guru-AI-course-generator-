import { View, Platform, ActivityIndicator,Text, Image } from 'react-native';
import Header from './../../components/Home/Header';
import NoCourse from './../../components/Home/NoCourse';
import Colors from './../../constant/Colors';
import { useContext, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './../../config/firebaseConfig';
import { UserDetailContext } from './../../context/UserDetailContext';
import CourseList from './../../components/Home/CourseList';
import PracticeSection from '../../components/Home/PracticeSection';
import CourseProgress from '../../components/Home/CourseProgress';
import { FlatList } from 'react-native';



const Home = () => {
  const { userDetail } = useContext(UserDetailContext);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);




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
          id: doc.id, // Include document ID
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

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={Colors.PRIMARY} style={{ flex: 1 }} />;
    }

    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.ERROR }}>{error}</Text>
        </View>
      );
    }

    if (courseList.length === 0) {
      return <NoCourse />;
    }

    return <CourseList courseList={courseList} />;
  };

  return (
    // to scroll the components 
    <FlatList 
    data = {[]}
    onRefresh={() => GetCourseList()}
    refreshing={loading}
    ListHeaderComponent = {
      <View style={{
        flex: 1,
        backgroundColor: Colors.WHITE,
      }} >
        <Image source={require('./../../assets/images/wave.png')} 
         style={{
          position : 'absolute',
          width : '100%',
          height : 500,


         }}
        
        />
      <View
      style={{
        padding: 25,
        paddingTop: (Platform.OS === 'ios' || Platform.OS === 'web') ? 45 : 25,
        
      }}
    >
      <Header />
      <View>
        <CourseProgress courseList={courseList} />
        <PracticeSection />
        {renderContent()}
        
      </View>
      

      </View>
      </View>
    } />
  );
};

export default Home;

