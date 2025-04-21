import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constant/Colors'
import * as Progress from 'react-native-progress';
import { imageAssets } from '../../constant/Option';

const CourseProgressCard = ({ item,  width = 280 }) => {
    const getCompletedText = (course) => {
        const completed = course?.completedChapter?.length || 0;
        const total = course?.chapters?.length || 0;
        return `${completed} Out of ${total} Chapters Completed`;
    };

    const GetCompletedChapters = (course) => {
        const completedChapters = course?.completedChapter?.length || 0;
        const totalChapters = course?.chapters?.length || 1;
        const perc = completedChapters / totalChapters;
        return isNaN(perc) ? 0 : perc;
    };

    return (
        <View style={{
            margin: 7,
            padding: 15,
            backgroundColor: Colors.WHITE,
            borderRadius: 15,
            width: width
        }}>
            <View style={{
                flexDirection: 'row',
                gap: 8
            }}>
                <Image 
                    source={imageAssets[item?.banner_image]}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8
                    }}
                />

                <View style={{ flex: 1 }}>
                    <Text 
                        numberOfLines={2}
                        style={{
                            fontFamily: 'outfit-bold',
                            fontSize: 19,
                        }}>
                        {item.courseTitle}
                    </Text>

                    <Text style={{
                        fontFamily: 'outfit-regular',
                        fontSize: 15
                    }}>
                        {item?.chapters?.length || 0} Chapters
                    </Text>
                </View>
            </View>

            <View style={{ marginTop: 10 }}>
                <Progress.Bar 
                    progress={GetCompletedChapters(item)} 
                    width={width - 30} 
                    color={Colors.PRIMARY}
                />
                <Text style={{
                    fontFamily: 'outfit-regular',
                    marginTop: 2
                }}>
                    {getCompletedText(item)}
                </Text>
            </View>
        </View>
    )
}

export default CourseProgressCard;