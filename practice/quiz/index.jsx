import { View, Text, Image, Pressable, Dimensions, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../../constant/Colors';
import * as Progress from 'react-native-progress';
import Button from './../../../components/Shared/Button';
import { db } from './../../../config/firebaseConfig'
import { updateDoc, doc } from 'firebase/firestore';

const Quiz = () => {
  const { courseParams } = useLocalSearchParams();
  const [course, setCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [quiz, setQuiz] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null); 
  const [result, setResult] = useState({}); 
  const [loading, setLoading] = useState(false);

  // Parse course params when component mounts
  useEffect(() => {
    try {
      if (courseParams) {
        const parsedCourse = JSON.parse(courseParams);
        setCourse(parsedCourse);
        setQuiz(parsedCourse?.quiz || []);
        
        // Debug log to check what's in parsedCourse
        console.log('Parsed course:', parsedCourse);
        console.log('Course ID:', parsedCourse?.id);
        console.log('Course docId:', parsedCourse?.docId);
      }
    } catch (error) {
      console.error('Error parsing course params:', error);
      Alert.alert('Error', 'Failed to load course data');
    }
  }, [courseParams]);

  useEffect(() => {
    console.log('Current result:', result);
  }, [result]);

  const GetProgress = (currentPage) => {
    const perc = (currentPage / (quiz?.length || 1));
    return perc;
  }

  const OnOptionSelect = (selectedChoice) => {
    setResult(prevResult => ({
      ...prevResult,
      [currentPage]: {
        userChoice: selectedChoice,
        isCorrect: quiz[currentPage]?.correctAns === selectedChoice,
        question: quiz[currentPage]?.question,
        correctAns: quiz[currentPage]?.correctAns
      }
    }));
  }

  const onQuizFinish = async () => {
    setLoading(true);
    
    // Check course and document ID
    if (!course) {
      console.error('Course data is missing');
      Alert.alert('Error', 'Course data is missing');
      setLoading(false);
      return;
    }
    
    // Try different ID fields that might be available
    const docId = course.docId || course.id || course._id;
    
    if (!docId) {
      console.error('Course document ID is missing or invalid');
      Alert.alert('Error', 'Course ID is missing');
      setLoading(false);
      return;
    }

    try {
      // Create a proper document reference
      const courseDocRef = doc(db, 'Courses', docId);
      
      // Log what we're trying to update
      console.log('Updating document with ID:', docId);
      console.log('With data:', { quizResult: result });
      
      // Perform the update
      await updateDoc(courseDocRef, {
        quizResult: result
      });
      
      console.log('Quiz results saved successfully');
      setLoading(false);
      
      router.replace({
        pathname: '/practice/quiz/summery',
        params: { resultParams : JSON.stringify(result) }
      });
    } catch (e) {
      console.error('Error saving quiz results:', e.message);
      Alert.alert('Error', 'Failed to save quiz results: ' + e.message);
      setLoading(false);
    }
  }

  if (!course || !quiz || quiz.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'outfit-medium', fontSize: 18 }}>Loading quiz...</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Image source={require('./../../../assets/images/wave.png')} 
        style={{
          height: 500,
          width: '100%'
        }}
      />
      <View style={{
        position: 'absolute',
        padding: 25,
        width: '100%'
      }}>
        <View style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="white" />
          </Pressable>
          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            color: Colors.WHITE
          }}>{currentPage + 1} of {quiz.length}</Text>
        </View>

        <View style={{
          marginTop: 20
        }}>
          <Progress.Bar 
            progress={GetProgress(currentPage)} 
            width={Dimensions.get('window').width*0.85}  
            color={Colors.WHITE}  
            height={10}
          />
        </View>

        <View style={{
          padding: 25,
          backgroundColor: Colors.WHITE,
          marginTop: 30,
          height: Dimensions.get('screen').height * 0.65,
          elevation: 1,
          borderRadius: 20
        }}>
          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            textAlign: 'center'
          }}>{quiz[currentPage]?.question}</Text>
          
          {quiz[currentPage]?.options.map((item, index) => (
            <TouchableOpacity 
              onPress={() => {
                setSelectedOption(index);
                OnOptionSelect(item);
              }}
              key={index} 
              style={{
                padding: 20,
                borderWidth: 1,
                borderRadius: 15,
                marginTop: 8,
                borderColor: selectedOption === index ? Colors.GREEN : '#ddd',
                backgroundColor: selectedOption === index ? Colors.LIGHT_GREEN : null
              }}
            >
              <Text style={{
                fontFamily: 'outfit-regular',
                fontSize: 20
              }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {(selectedOption !== null && currentPage < quiz.length - 1) && 
          <Button 
            text={'Next'} 
            onPress={() => {
              setCurrentPage(currentPage + 1);
              setSelectedOption(null);
            }}
          /> 
        }

        {(selectedOption !== null && currentPage === quiz.length - 1) && 
          <Button 
            text="Finish" 
            loading={loading}
            onPress={onQuizFinish}
          />
        } 
      </View>
    </ScrollView>
  )
}

export default Quiz
