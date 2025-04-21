
import {  Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from './../constant/Colors';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './../config/firebaseConfig';
import { useContext, useEffect } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { doc, getDoc } from "firebase/firestore";

export default function Index() {
  // to navigate through other pages
  const router = useRouter();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);

  // Use useEffect to handle authentication state
  useEffect(() => {
    // to load the user directly to the home screen if user is already logged in
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        try {
          // IMPORTANT: Change this to use UID instead of email
          const userRef = doc(db, 'users', user.uid);
          const result = await getDoc(userRef);
          
          if (result.exists()) {
            const userData = result.data();
            console.log("User data retrieved:", userData);
            setUserDetail(userData);
            router.replace('/(tabs)/home');
          } else {
            console.log("No user document found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No user logged in");
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.WHITE
      }}
    >
      <Image 
        source={require('./../assets/images/landing.png')}
        style={{
          width: '100%',
          height: 300,
          marginTop: 70
        }}
      />
      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: '200%',
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35
        }}
      >
        <Text style={{  // Fixed lowercase 'text' to uppercase 'Text'
          fontSize: 30,
          fontWeight: 'bold',
          textAlign: 'center',
          color: Colors.WHITE,
          fontFamily: 'outfit-bold'
        }}>Welcome to Coaching Guru</Text>
        <Text style={{
          fontSize: 20,
          color: Colors.WHITE,
          marginTop: 20,
          textAlign: 'center',  // Fixed typo in textAlign
          fontFamily: 'outfit-regular'
        }}>Transform your ideas into engaging educational content, effortlessly with all </Text>

        {/* button for get started and other one */}
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/auth/signUp')}
        >
          <Text style={[styles.buttonText, {color: Colors.PRIMARY}]}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, {
            backgroundColor: Colors.PRIMARY,
            borderWidth: 1,
            borderColor: Colors.WHITE
          }]} 
          onPress={() => router.push('/auth/signIn')}
        >
          <Text style={[styles.buttonText, {
            color: Colors.WHITE
          }]}>Already Have an Account?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    backgroundColor: Colors.WHITE,
    marginTop: 20,
    borderRadius: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'outfit-regular'
  }
});

