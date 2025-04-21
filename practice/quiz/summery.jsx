import { View, Text, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Colors from '../../../constant/Colors';
import Button from '../../../components/Shared/Button';

const QuizSummery = () => {
  const { resultParams } = useLocalSearchParams();
  const [quizResult, setQuizResult] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0); 
  const router = useRouter();
  
  useEffect(() => {
    if (resultParams) {
      try {
        const parsedResults = JSON.parse(resultParams);
        console.log('Parsed results:', parsedResults);
        
        const resultsArray = Array.isArray(parsedResults) 
          ? parsedResults 
          : Object.values(parsedResults);
        
        setQuizResult(resultsArray);
        setTotalQuestions(resultsArray.length); // Set total questions here
        calculateResult(resultsArray);
      } catch (error) {
        console.error('Error parsing quiz results:', error);
      }
    } else {
      console.log('No result params provided');
    }
  }, [resultParams]);
  
  const calculateResult = (results) => {
    if (!results || results.length === 0) {
      console.log('No results to calculate');
      return;
    }
    
    const correct = results.filter(item => item?.isCorrect === true);
    console.log('Correct answers:', correct);
    setCorrectAnswers(correct.length);
  }

  const GetPercMark = () => {
    if (totalQuestions === 0) return 0; // Prevent division by zero
    return (correctAnswers / totalQuestions) * 100;
  }
  
  return (
    <View>
      <Image 
        source={require('./../../../assets/images/wave.png')}
        style={{
          width: '100%',
          height: 700
        }}
      />
      
      <View style={{
        position: 'absolute',
        width: '100%',
        padding: 35
      }}>
        <Text style={{
          textAlign: 'center',
          fontFamily: 'outfit-bold',
          fontSize: 30,
          color: Colors.WHITE
        }}>Quiz Summary</Text>
        
        <View style={{
          backgroundColor: Colors.WHITE,
          padding: 20,
          borderRadius: 20,
          marginTop: 60,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Image 
            source={require('./../../../assets/images/trophy.png')} 
            style={{
              width: 100,
              height: 100,
              marginTop: -60
            }}
          />
          <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 20,
            marginTop: 10
          }}>
            {GetPercMark() >= 60 ? 'Congratulations!' : 'Try Again'}
          </Text>
          
          {/* Added score display for better user feedback */}
          {totalQuestions > 0 && (
            <Text style={{
              fontFamily: 'outfit-medium',
              fontSize: 16,
              marginTop: 10
            }}>
              Score: {correctAnswers}/{totalQuestions} ({Math.round(GetPercMark())}%)
            </Text>
          )}
        </View>
          <Button text={'Back to Home'} 
          onPress={()=> router.replace('/(tabs)/home')}/>

      </View>
    </View>
  )
}

export default QuizSummery