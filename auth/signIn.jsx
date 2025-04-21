
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, Platform, Alert,Image } from 'react-native'
import React, { useState } from 'react'
import Colors from './../../constant/Colors'
import { useRouter } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from './../../config/firebaseConfig'
import { getDoc, doc } from 'firebase/firestore'

const signIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  

  // Cross-platform toast/alert function
  const showMessage = (message) => {
    if (Platform.OS === 'android') {
      // For Android
      if (Platform.OS === 'android' && Platform.constants) {
        // Only import and use ToastAndroid if we're on Android
        const { ToastAndroid } = require('react-native');
        ToastAndroid.show(message, ToastAndroid.BOTTOM);
      } else {
        // Fallback for web or when ToastAndroid is not available
        alert(message);
      }
    } else {
      // For iOS and web
      Alert.alert('Message', message);
    }
  };

  const onSignInClick = async () => {
    if (!email || !password) {
      showMessage('Please enter both email and password');
      return;
    }

    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User signed in:', user.uid);
      
      // Get user details from Firestore
      await getUserDetail(user.uid);
      
      // Navigate to home screen after successful login
      router.replace('/(tabs)/home')
    } catch (error) {
      console.log('Sign-in error:', error.message);
      showMessage('Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  const getUserDetail = async (userId) => {
    try {
      // Get user document using user's UID instead of email
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        console.log('User data:', userSnap.data());
        return userSnap.data();
      } else {
        console.log('No user document found');
        return null;
      }
    } catch (error) {
      console.log('Error fetching user details:', error.message);
      throw error;
    }
  };

  return (
    <View style={{
      display: 'flex',
      alignItems: 'center',
      paddingTop: 100,
      flex: 1,
      padding: 25,
      backgroundColor: Colors.WHITE
    }}>
      <Image source={require('./../../assets/images/logo.png')}
        style={{
          width: 180,
          height: 180,
        }}
      />
      <Text style={{
        fontSize: 30,
        fontFamily: 'outfit-bold'
      }}>Welcome Back</Text>

      <TextInput 
        placeholder='Email' 
        onChangeText={(value) => setEmail(value)}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.textInput} 
      />
      <TextInput 
        placeholder='Password' 
        onChangeText={(value) => setPassword(value)} 
        secureTextEntry={true} 
        style={styles.textInput} 
      />

      {/* SignIn Button */}
      <TouchableOpacity
        onPress={onSignInClick}
        disabled={loading}
        style={{
          padding: 15,
          backgroundColor: loading ? Colors.GRAY : Colors.PRIMARY,
          width: '100%',
          marginTop: 25,
          borderRadius: 10
        }}>
        <Text style={{
          fontFamily: 'outfit-regular',
          fontSize: 20,
          color: Colors.WHITE,
          textAlign: 'center'
        }}>{loading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>

      <View style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        marginTop: 20
      }}>
        <Text style={{fontFamily: 'outfit-regular'}}>Don't have an account? </Text>
        <Pressable
          onPress={() => router.push('/auth/signUp')}
        >
          <Text style={{
            color: Colors.PRIMARY,
            fontFamily: 'outfit-bold'
          }}>Create New account</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    width: '100%',
    padding: 15,
    fontSize: 18,
    marginTop: 20,
    borderRadius: 8
  }
})

export default signIn