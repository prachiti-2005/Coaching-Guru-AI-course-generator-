import { View, Text, Image, Pressable, FlatList, Dimensions, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constant/Colors';
import FlipCard from 'react-native-flip-card';

const FlashCards = () => {
    const { courseParams } = useLocalSearchParams();
    const course = JSON.parse(courseParams);
    const flashcard = course?.flashcards || [];
    const [currentPage, setCurrentPage] = useState(0); // Initialize with 0 instead of null
    const width = Dimensions.get('screen').width*0.85;

    const onScroll = (event)=>{
        const index = Math.round(event?.nativeEvent?.contentOffset.x/width);
        console.log(index);
        setCurrentPage(index);
    }

    return (
        <View style={{ flex: 1 }}>
            <Image 
                source={require('./../../assets/images/wave.png')} 
                style={{
                    height: 500,
                    width: '100%'
                }}
            />
            
            <View style={{
                position: 'absolute',
                top: 50, 
                left: 0,
                right: 0,
                paddingHorizontal: 20,
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
                    }}>
                        {currentPage + 1} of {flashcard?.length}
                </Text>
                </View>
            <FlatList 
            data= {flashcard}
            horizontal = {true}
            pagingEnabled = {true}
            showsHorizontalScrollIndicator = {false}
            onScroll = {onScroll}
            contentContainerStyle={{ alignItems: 'center' }}
            renderItem={({item, index}) => (
                <View key={index}
                style={{
                    height: 500,
                    width: Dimensions.get('screen').width,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop : 60
                }}>
                <FlipCard style={{
                    width: width,
                    height: 300,
                    backgroundColor: Colors.WHITE,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                }}>
                    {/* Face Side */}
                    <View style={{
                        display : 'flex',
                        justifyContent : 'center',
                        alignItems : 'center',
                        height : '100%',
                        borderRadius : 20
                    }}>
                        <Text style={{
                            fontFamily : 'outfit-bold',
                            fontSize : 28
                        }}>{item?.front}</Text>
                    </View>

                    {/* Back Side */}
                    <View style={{
                        display : 'flex',
                        justifyContent : 'center',
                        alignItems : 'center',
                        height : '100%',
                        backgroundColor : Colors.PRIMARY,
                        borderRadius : 20
                    }}>
                        <Text style={{
                            width : Dimensions.get('screen').width * 0.85,
                            fontFamily : 'outfit-regular',
                            fontSize : 28,
                            padding : 20,
                            textAlign : 'center',
                            color : Colors.WHITE
                        }}>{item?.back}</Text>
                    </View>

                </FlipCard>

                </View>
            )}
            />
            </View>
        </View>
    )
}

export default FlashCards

