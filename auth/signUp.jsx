import { View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable, Alert, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from './../../constant/Colors'
import { useRouter } from 'expo-router'
import { auth, db } from '../../config/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc } from 'firebase/firestore'
import {UserDetailContext} from './../../context/UserDetailContext';

const signUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const {userDetail,setUserDetail} = useContext(UserDetailContext);


  const CreateNewAccount = async () => {
    // Check if all fields are filled
    if (!fullName || !email || !password) {
      console.log('Please fill all fields');
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create authentication account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created with auth:', user.uid);
      
      // Save user details to Firestore
      await SaveUser(user);
      
      Alert.alert('Success', 'Account created successfully!');
      // Navigate to sign in page after successful signup
      router.push('/auth/signIn');
    } catch (error) {
      console.log('Error creating account:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  const SaveUser = async (user) => {
    try {
      // Create a user profile document in Firestore
      const userRef = doc(db, 'users', user.uid);
      
      // Define the user data to save
      const userData = {
        name: fullName,
        email: email,
        uid: user.uid,
        member: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
       
      };
      
      // Set the document data
      await setDoc(userRef, userData);
      console.log('User data saved to Firestore');

      setUserDetail(userData);
      
      return true;
    } catch (error) {
      console.log('Error saving user to Firestore:', error.message);
      throw error; // Re-throw to handle in the calling function
    }
  }
  
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
      }}>Create New Account</Text>

      <TextInput 
        placeholder='Full Name' 
        onChangeText={(value) => setFullName(value)} 
        style={styles.textInput} 
      />
      <TextInput 
        placeholder='Email' 
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(value) => setEmail(value)} 
        style={styles.textInput} 
      />
      <TextInput 
        placeholder='Password' 
        onChangeText={(value) => setPassword(value)} 
        secureTextEntry={true} 
        style={styles.textInput} 
      />

      <TouchableOpacity
        onPress={CreateNewAccount}
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
        }}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <View style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          marginTop: 20
      }}>
        <Text style={{fontFamily: 'outfit-regular'}}>Already Have an Account? </Text>
        <Pressable
            onPress={() => router.push('/auth/signIn')}
        >
            <Text style={{
                color: Colors.PRIMARY,
                fontFamily: 'outfit-bold'
            }}>Sign In Here</Text>
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

export default signUp