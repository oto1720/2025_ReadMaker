import React,{ useState } from 'react';
import { Text,View,StyleSheet,StatusBar,TouchableOpacity,TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function WriteText() {
    return (
        <View style={styles.writeScreen}>
            <Text style={styles.itemText}>読みたい文章を入力してください</Text>
            <TextInput
                style={styles.textHolder}
                placeholder="ここにテキストを入力してください"
                multiline
                />
        </View>
    );
}

function AozoraSelect() {
    return (
        <View style={styles.content}>
            <Text style={{ fontSize: 18 }}>Aozora Select Screen</Text>
        </View>
    );
}

export default function TextSelectScreen(){
    const [currentTab,setCurrentTab]=useState('write');
    const ShowScreen=()=>{
        switch(currentTab){
            case 'write':
                return <WriteText/>;
            case 'aozora':
                return <AozoraSelect/>;
        }
    };
    return(
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#lala2e"/>
                <LinearGradient style={styles.header} colors={['#1a1a2e', '#16213e', '#0f3460']}>
                    <Text style={styles.headerTitle}>テキスト設定</Text>
                    <Text style={styles.subTitle}>読みたい文章を選択してください</Text>
                </LinearGradient>
                <View style={styles.button}>
                    <TouchableOpacity style={[styles.switchButton,currentTab==='write'&&styles.activeButton]}
                        onPress={()=>setCurrentTab('write')}
                    >
                        <Text style={styles.buttonText}>テキスト入力</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.switchButton,currentTab==='aozora'&&styles.activeButton]}
                        onPress={()=>setCurrentTab('aozora')}
                        >
                        <Text style={styles.buttonText}>青空文庫</Text>
                    </TouchableOpacity>
                </View>
                {ShowScreen()}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingTop: StatusBar.currentHeight || 40,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 12,
        color: '#ccc',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#16213e',
    },
    switchButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#2a2a4e',
    },
    activeButton: {
        backgroundColor: '#ff8c00',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    writeScreen:{
        flex:1,
        alignItems:'center',
        marginLeft:10
    },itemText:{
        fontSize:16,
        color:'#000',
        alignSelf:'flex-start',
        marginTop:10
    },
    textHolder:{
        height: 100,
        borderColor: 'gray',
        borderWidth: 1,
        width: '90%',
        marginTop: 10 ,
        
    }
});
