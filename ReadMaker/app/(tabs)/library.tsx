import React from 'react';
import {
    Text,
    View,
    StyleSheet,
    ScrollView
} from 'react-native';

class TextSelectScreen extends React.Component{
    render(){
        return(
            <ScrollView>
                <View style={styles.title}>
                        <Text>テキスト設定</Text>
                        <Text style={styles.subtitle}>読みたいテキストを選択してください</Text>
                </View> 
           </ScrollView>
        )
    }
}
const styles=StyleSheet.create({
    containar:{
        flex:1,
        backgroundColor:'white'
    },
    title:{
        flexDirection:'column',
        fontSize:16,
        color:'black',
        marginTop:20,
        marginLeft:10
    },
    subtitle:{
        fontSize:10,
        color:'gray'
    }
})
export default TextSelectScreen;