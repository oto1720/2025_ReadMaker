import React,{ useState } from 'react';
import { Text,View,StyleSheet,StatusBar,TouchableOpacity,TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


function WriteText() {
    const [titleBoxHeight, setTitleBoxHeight] = useState(40);
    const [textBoxHeight, setTextBoxHeight] = useState(40);
    const [text, setText] = useState('');
    function GetDifficult(length:number){
        switch(true){
            case length<50:
                return '初級';
            case length<200:
                return '中級';
            case length<400:
                return '上級';
            case length>=400:
                return '超上級';
        }
    }
    return (
        <View style={styles.writeScreen}>
            <Text style={styles.itemText}>タイトルを入力してください</Text>
            <TextInput
                style={{
                    height: Math.max(40, titleBoxHeight),
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: '100%',
                    marginTop: 10 , 
                    textAlignVertical: 'top',
                }}
                placeholder="例) 竹取物語"
                multiline
                onContentSizeChange={(e)=>{
                    setTitleBoxHeight(e.nativeEvent.contentSize.height);
                }}
                />
            <Text style={styles.itemText}>読みたい文章を入力してください</Text>
            <TextInput style={{
                    height: Math.max(40, textBoxHeight),
                    borderColor: 'gray',
                    borderWidth: 1,
                    width: '100%',
                    marginTop: 10 , 
                    textAlignVertical: 'top',
                }}
                placeholder="例) 今は昔、竹取の翁と畏怖ものありけり…"
                value={text}
                onChangeText={(text)=>setText(text)}
                multiline
                onContentSizeChange={(e)=>{
                    setTextBoxHeight(e.nativeEvent.contentSize.height);
                }}
            >
            </TextInput>
            <Text style={{alignSelf:'flex-start',color:'gray'}}>{text.length}文字 | 難易度:{GetDifficult(text.length)}</Text>
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
        marginLeft:10,
        marginRight:10,
    },itemText:{
        fontSize:16,
        color:'#000',
        alignSelf:'flex-start',
        marginTop:10
    },
    textHolder:{
           
    }
});
