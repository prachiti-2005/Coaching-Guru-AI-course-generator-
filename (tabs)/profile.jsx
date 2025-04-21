import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import Colors from '../../constant/Colors'
import { ScrollView } from 'react-native-web'
import Button from '../../components/Shared/Button'
import { UserDetailContext } from '../../context/UserDetailContext'
import { useRouter } from 'expo-router'
import { db } from '../../config/firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons' // Make sure you have expo/vector-icons installed

const Profile = () => {
  const { userDetail } = useContext(UserDetailContext);
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!userDetail?.email) return;
      
      try {
        setLoading(true);
        const q = query(
          collection(db, 'Courses'),
          where('createdBy', '==', userDetail.email)
        );
        
        const querySnapshot = await getDocs(q);
        const userCourses = [];
        
        querySnapshot.forEach((doc) => {
          userCourses.push({ id: doc.id, ...doc.data() });
        });
        
        setCourses(userCourses);
        console.log("Fetched courses:", userCourses); // Add this for debugging
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [userDetail?.email]);

  // Calculate course statistics
  const totalCourses = courses.length;
  const completedCourses = courses.filter(course => 
    course.completedChapter?.length === course.chapters?.length
  ).length;
  const inProgressCourses = totalCourses - completedCourses;

  return (
    <ScrollView style={{
      padding: 25,
      backgroundColor: Colors.WHITE,
      flex: 1
    }}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {/* Standard profile icon instead of photo or initial */}
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color={Colors.WHITE} />
          </View>
        </View>
        
        <Text style={styles.userName}>
          {userDetail?.name || userDetail?.fullName || userDetail?.displayName || 'User'}
        </Text>
        
        <Text style={styles.userEmail}>
          {userDetail?.email || ''}
        </Text>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalCourses}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedCourses}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{inProgressCourses}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
      </View>

      {/* Add Course Button */}
      <View style={styles.buttonContainer}>
        <Button 
          text="+ Add More Courses"
          onPress={() => router.push('/addCourse')}
        />
      </View>

      {/* User Courses Section - Now showing only course titles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Courses</Text>
        
        {loading ? (
          <Text style={styles.loadingText}>Loading courses...</Text>
        ) : courses.length === 0 ? (
          <Text style={styles.emptyText}>No courses yet. Add your first course!</Text>
        ) : (
          <View style={styles.coursesContainer}>
            {courses.map((course) => (
              <View key={course.id} style={styles.courseItem}>
                {/* Changed from course.title to course.courseTitle to match Firestore data */}
                <Text style={styles.courseTitle}>{course.courseTitle}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <Pressable style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Profile</Text>
        </Pressable>
        <Pressable style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Settings</Text>
        </Pressable>
        <Pressable style={styles.settingItem}>
          <Text style={styles.settingText}>Help & Support</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    marginBottom: 5,
  },
  userEmail: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GREY,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GREY,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'outfit-bold',
    fontSize: 24,
    color: Colors.PRIMARY,
  },
  statLabel: {
    fontFamily: 'outfit',
    fontSize: 14,
    color: Colors.GREY,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 20,
    marginBottom: 15,
  },
  loadingText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GREY,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontFamily: 'outfit',
    fontSize: 16,
    color: Colors.GREY,
    textAlign: 'center',
    marginTop: 20,
  },
  coursesContainer: {
    gap: 15,
    elevation : 1,
  },
  courseItem: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BLACK,
  },
  courseTitle: {
    fontFamily: 'outfit-bold',
    fontSize: 18,
    color : Colors.GREY
  },
  settingItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: Colors.LIGHT_GREY,
  },
  settingText: {
    fontFamily: 'outfit',
    fontSize: 16,
  },
})

export default Profile