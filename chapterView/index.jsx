import { View, Text, Dimensions, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Progress from 'react-native-progress'
import Colors from '../../constant/Colors'
import Button from './../../components/Shared/Button';
import { updateDoc, doc, arrayUnion, getDoc } from '@firebase/firestore'
import { db } from '../../config/firebaseConfig';

const ChapterView = () => {
    const params = useLocalSearchParams();
    
    const [currentPage, setCurrentPage] = useState(0);
    const [loader, setLoader] = useState(false);
    const router = useRouter();
    
    const GetProgress = (currentPage) => {
        const perc = (currentPage / chapter?.content?.length);
        return perc;
    }

    // Safely parse the chapterParams
    let chapter = null;
    let docId = null;
    let chapterIndex = null;
    try {
        if (params.chapterParams) {
            chapter = JSON.parse(params.chapterParams);
            docId = params.docId;
            chapterIndex = Number(params.chapterIndex); // Ensure this is a number
        }
    } catch (error) {
        console.error("Error parsing chapterParams:", error);
    }

    const onChapterComplete = async () => {
        console.log("Completing chapter:", {
            docId,
            chapterIndex,
            currentChapter: chapter?.content[currentPage]?.topic
        });

        if (!docId || chapterIndex === null) {
            console.error("Missing docId or chapterIndex");
            alert("Error: Missing document reference");
            return;
        }

        setLoader(true);
        try {
            const courseRef = doc(db, 'Courses', docId);
            
            // Verify document exists
            const docSnap = await getDoc(courseRef);
            if (!docSnap.exists()) {
                throw new Error("Document doesn't exist!");
            }
            console.log("Current completed chapters:", docSnap.data()?.completedChapter);

            // Update document
            await updateDoc(courseRef, {
                completedChapter: arrayUnion(chapterIndex)
            });
            
            console.log("Successfully marked chapter as completed");
            router.back();
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Failed to save progress: " + error.message);
        } finally {
            setLoader(false);
        }
    }

    return (
        <View style={{
            padding: 25,
            backgroundColor: Colors.WHITE,
            flex: 1,
        }}>
            <Progress.Bar progress={GetProgress(currentPage)} 
                width={Dimensions.get('screen').width * 0.85} />

            <View style={{
                marginTop: 20,
                marginBottom: 80
            }}>
                <Text style={{
                    fontFamily: 'outfit-bold',
                    fontSize: 25
                }}>{chapter?.content[currentPage]?.topic}</Text>

                <Text style={{
                    fontFamily: 'outfit-regular',
                    fontSize: 20,
                    marginTop: 7
                }}>{chapter?.content[currentPage]?.explain}</Text>

                {chapter?.content[currentPage]?.code && <Text style={[styles.codeExampleText, { backgroundColor: Colors.BLACK, color: Colors.WHITE }]}>{chapter?.content[currentPage]?.code}</Text>}
                
                {chapter?.content[currentPage]?.example && <Text style={styles.codeExampleText}>{chapter?.content[currentPage]?.example}</Text>}
            </View>
            
            <View style={styles.buttonContainer}>
                {chapter?.content?.length - 1 != currentPage ?
                    <Button text={'Next'} onPress={() => setCurrentPage(currentPage + 1)} />
                    : <Button text={'Finish'} onPress={() => onChapterComplete()} loading={loader} />}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    codeExampleText: {
        padding: 15,
        backgroundColor: Colors.BG_GREY,
        borderRadius: 15,
        fontFamily: 'outfit-regular',
        fontSize: 18,
        marginTop: 15
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 25
    }
})

export default ChapterView