
import { View, Text, StyleSheet, Pressable} from 'react-native'
import React, { useContext, useState } from 'react'
import Colors from '../../constant/Colors'
import { ScrollView, TextInput } from 'react-native-web'
import Button from '../../components/Shared/Button'
import { GenerateCourseAIModel, GenerateTopicsAIModel } from '../../config/AiModel'
import Prompt from '../../constant/Prompt'
import {db} from '../../config/firebaseConfig';
import {UserDetailContext} from '../../context/UserDetailContext'
import { useRouter } from 'expo-router'
import { doc, setDoc } from 'firebase/firestore'

const AddCourse = () => {
  const [loading, setLoading] = useState(false);
  const {userDetail, setUserDetail} = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState([]);
  const router = useRouter();

  const onGenerateTopic = async() => {
    setLoading(true);
    try {
      // Get topic idea from AI model
      const PROMPT = userInput + Prompt.IDEA;
      const aiResp = await GenerateTopicsAIModel.sendMessage(PROMPT);
      
      try {
        const topicIdea = JSON.parse(aiResp.response.text());
        console.log(topicIdea);
        
        if (topicIdea?.course_titles && Array.isArray(topicIdea.course_titles)) {
          setTopics(topicIdea.course_titles);
        } else {
          console.error("Invalid topics format:", topicIdea);
          alert("Couldn't generate topics. Please try again.");
        }
      } catch (jsonError) {
        console.error("JSON parsing error in topics:", jsonError);
        alert("Error processing AI response. Please try different input.");
      }
    } catch (error) {
      console.error("Topic generation failed:", error);
      alert("Failed to generate topics. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const onTopicSelect = (topic) => {
    const isAlreadyExist = selectedTopic.find((item) => item == topic);
    if(!isAlreadyExist) {
      setSelectedTopic(prev => [...prev, topic])
    } else {
      const topics = selectedTopic.filter(item => item !== topic);
      setSelectedTopic(topics);
    }
  }

  const isSTopicSelected = (topic) => {
    const selection = selectedTopic.find(item => item == topic);
    return selection ? true : false
  }

  // Safely parse JSON with fallback options
  const safelyParseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Initial JSON parsing failed:", error);
      
      // Try cleaning the string
      try {
        // Remove potential line breaks, tabs, and other problematic characters
        const cleanedText = jsonString.replace(/[\r\n\t]/g, " ");
        
        // Try to fix common JSON issues like unterminated strings
        const escapedText = cleanedText.replace(/\\/g, "\\\\").replace(/(?<!\\)"/g, '\\"');
        const wrappedText = `{"rawtext":"${escapedText}"}`;
        
        // Parse the wrapped text and return a placeholder structure
        JSON.parse(wrappedText);
        
        // If we get here, the JSON was valid after wrapping, so let's try to extract a more useful structure
        // This is a best-effort approach to salvage data
        const extractedJSON = extractJSONFromText(cleanedText);
        if (extractedJSON) {
          return extractedJSON;
        }
        
        // Return a minimal valid structure if extraction failed
        return { courses: [] };
      } catch (fallbackError) {
        console.error("Failed to salvage JSON:", fallbackError);
        return { courses: [] };
      }
    }
  }

  // Attempt to extract JSON from text that might contain non-JSON content
  const extractJSONFromText = (text) => {
    try {
      // Look for JSON-like patterns
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Used to generate course using AI model
  // const onGenerateCourse = async() => {
  //   if (selectedTopic.length === 0) {
  //     alert("Please select at least one topic");
  //     return;
  //   }
    
  //   setLoading(true);
  //   const PROMPT = selectedTopic.join(', ') + Prompt.COURSE;
    
  //   try {
  //     const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
  //     const rawText = aiResp.response.text();
      
  //     // Use our safe parsing method
  //     const resp = safelyParseJSON(rawText);
  //     const courses = resp?.courses || [];
      
  //     console.log("Parsed courses:", courses);
      
  //     if (courses && courses.length > 0) {
  //       try {
          

  //           // Use Promise.all to wait for all database operations to complete
  //           const savePromises = courses.map(async(course) => {
  //             if (!course || typeof course !== 'object') {
  //               console.error("Invalid course object:", course);
  //               return Promise.resolve(); // Skip invalid courses
  //             }
              
  //             // Create a unique docID
  //             const docID = Date.now().toString() + Math.floor(Math.random() * 1000);
              
  //             // Create document data with checks for undefined values
  //             const docData = {
  //               ...course,
  //               docID: docID, // Add docID field
  //               createdOn: new Date(),
  //               // Only add createdBy if userDetail and email exist
  //               ...(userDetail?.email ? { createdBy: userDetail.email } : {})
  //             };
              
  //             return await setDoc(doc(db, 'Courses', docID), docData);
  //           });


          
  //         // Wait for all database operations to complete
  //         await Promise.all(savePromises);
          
  //         // Successfully saved, now navigate home
  //         router.push('/(tabs)/home');
  //       } catch (dbError) {
  //         console.error("Database error:", dbError);
  //         alert("Failed to save courses. Please try again.");
  //       }
  //     } else {
  //       alert("No valid courses generated. Please try different topics.");
  //     }
  //   } catch(e) {
  //     console.error("Error generating course:", e);
  //     alert("Error generating course. Please try again later.");
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const onGenerateCourse = async() => {
    if (selectedTopic.length === 0) {
      alert("Please select at least one topic");
      return;
    }
    
    setLoading(true);
    const PROMPT = selectedTopic.join(', ') + Prompt.COURSE;
    
    try {
      const aiResp = await GenerateCourseAIModel.sendMessage(PROMPT);
      const rawText = aiResp.response.text();
      const resp = safelyParseJSON(rawText);
      const courses = resp?.courses || [];
      
      console.log("Parsed courses:", courses);
      
      if (courses && courses.length > 0) {
        try {
          const savePromises = courses.map(async(course) => {
            if (!course || typeof course !== 'object') {
              console.error("Invalid course object:", course);
              return Promise.resolve();
            }
            
            const docID = Date.now().toString() + Math.floor(Math.random() * 1000);
            
            // Create document data with completedChapter field initialized as empty array
            const docData = {
              ...course,
              docID: docID,
              createdOn: new Date(),
              completedChapter: [], // Initialize as empty array
              ...(userDetail?.email ? { createdBy: userDetail.email } : {})
            };
            
            return await setDoc(doc(db, 'Courses', docID), docData);
          });
  
          await Promise.all(savePromises);
          router.push('/(tabs)/home');
        } catch (dbError) {
          console.error("Database error:", dbError);
          alert("Failed to save courses. Please try again.");
        }
      } else {
        alert("No valid courses generated. Please try different topics.");
      }
    } catch(e) {
      console.error("Error generating course:", e);
      alert("Error generating course. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <ScrollView style={{
      padding: 25,
      backgroundColor: Colors.WHITE,
      flex: 1
    }}>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 30
      }}>Create New Course</Text>
      
      <Text style={{
        fontFamily: 'outfit',
        fontSize: 30
      }}>What you want to learn today?</Text>
      
      <Text style={{
        fontFamily: 'outfit',
        fontSize: 20,
        marginTop: 8,
        color: Colors.GREY
      }}>Write what course you want to create(Ex. Learn React Js, Digital Marketing Guide, 10th Science Chapter)</Text>
          
      <TextInput 
        placeholder="(Ex. Learn Python, Learn 12th Chemistry)"
        style={styles.textInput}
        numberOfLines={3}
        multiline={true}
        onChangeText={(value) => setUserInput(value)}
      />
      
      <Button 
        text={'Generate Topic'} 
        type='outline'
        onPress={() => onGenerateTopic()} 
        loading={loading}
      />
      
      <View style={{
        marginTop: 15,
        marginBottom: 10
      }}>
        {topics.length > 0 && (
          <>
            <Text style={{
              fontFamily: 'outfit',
              fontSize: 20
            }}>Select all topics which you want to add in the course</Text>
          
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 6
            }}>
              {topics.map((item, index) => (
                <Pressable key={index} onPress={() => onTopicSelect(item)}>
                  <Text style={{
                    padding: 7,
                    borderWidth: 0.4,
                    borderRadius: 99,
                    paddingHorizontal: 15,
                    backgroundColor: isSTopicSelected(item) ? Colors.PRIMARY : null,
                    color: isSTopicSelected(item) ? Colors.WHITE : Colors.PRIMARY
                  }}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </View>

      {selectedTopic?.length > 0 && (
        <Button 
          text='Generate Course'
          onPress={() => onGenerateCourse()}
          loading={loading}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  textInput: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    height: 100,
    marginTop: 10,
    color: Colors.GREY,
    alignItems: 'flex-start',
    fontSize: 18
  }
})

export default AddCourse

