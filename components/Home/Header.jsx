import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { UserDetailContext } from './../../context/UserDetailContext'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../../constant/Colors';

const Header = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  
  return (
    <View style={{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems : 'center'
    }}>
      <View>
        <Text style={{
        fontFamily : 'outfit-bold',
        fontSize : 25,
        color : Colors.WHITE
        }}>Hello, {userDetail?.name || userDetail?.fullName || userDetail?.displayName || 'Guest'}
        </Text>
        <Text style={{
        fontFamily : 'outfit',
        fontSize : 17,
        color : Colors.WHITE
        }}>Let's Get Started</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="settings-outline" size={32} color="white" />
      </TouchableOpacity>
    </View>
  )
}



export default Header