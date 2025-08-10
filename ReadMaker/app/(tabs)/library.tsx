import React,{ useState } from 'react';
import { Text,View,StyleSheet,StatusBar,TouchableOpacity,TextInput,ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


function WriteText() {
    const [titleBoxHeight, setTitleBoxHeight] = useState(40);
    const [textBoxHeight, setTextBoxHeight] = useState(40);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [howToShow, setHowToShow] = useState('normal');
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
        <ScrollView >
            <View>
                <View style={styles.writeScreen}>        
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>タイトル</Text>
                        <TouchableOpacity onPress={()=>
                                setTitle('')  
                            }>
                            <Text style={styles.clearButton}>✖</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={{
                            height: Math.max(40, titleBoxHeight),
                            backgroundColor: '#e8e8e8',
                            borderWidth: 0,
                            width: '100%',
                            marginTop: 10 , 
                            borderRadius:5,
                            textAlignVertical: 'top',
                        }}
                        placeholder="例) 竹取物語"
                        multiline
                        onContentSizeChange={(e)=>{
                            setTitleBoxHeight(e.nativeEvent.contentSize.height);
                        }}
                        />
                </View>
                <View style={styles.writeScreen}>
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>文章</Text>
                        <TouchableOpacity onPress={()=>
                                setText('')
                            }>
                            <Text style={styles.clearButton}>✖</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={{
                            height: Math.max(40, textBoxHeight),
                            backgroundColor: '#e8e8e8',
                            borderWidth: 0,
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
                    </View>
                    <Text style={{
                        alignSelf:'flex-start',
                        color:'#000000',
                        marginLeft:15,
                        }}>{text.length}文字 | 難易度:{GetDifficult(text.length)}</Text>
                
                <View style={styles.writeScreen}>
                    <Text style={{fontSize:17,fontWeight:'bold'}}>読み取り設定</Text>
                    <Text style={styles.itemText}>表示方法</Text>              
                    <View style={{flexDirection:'row',
                        alignSelf:'flex-start',
                        justifyContent:'space-between',
                        marginVertical:5,
                        marginLeft:10,
                        }}>
                        <TouchableOpacity style={[styles.toggleButton,howToShow==='normal'&&styles.ON]}onPress={()=>
                            setHowToShow('normal')
                        }></TouchableOpacity>
                        <Text style={{fontSize:20}}>通常表示</Text>
                    </View>
                    <View style={{flexDirection:'row',
                        alignSelf:'flex-start',
                        justifyContent:'space-between',
                        marginVertical:5,
                        marginLeft:10,
                        }}>
                        <TouchableOpacity style={[styles.toggleButton,howToShow==='word'&&styles.ON]} onPress={()=>
                            setHowToShow('word')
                        }></TouchableOpacity>
                    <Text style={{fontSize:20}}>単語別表示</Text>
                    </View>
                </View>
            </View>
        </ScrollView>

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
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
    },
    subTitle: {
        fontSize: 15,
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
        fontSize: 16,
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
        backgroundColor:'#e8f4f9ff',
        borderRadius:5,
        borderWidth:0,
        borderColor:'#b0c4de',
        marginVertical:10,
        shadowColor:'#000',
        shadowOffset:{width:1,height:2},
        shadowRadius:5.84,
        elevation:9,
    },
    itemView:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%',
        justifyContent:'space-between',
    },
    itemText:{
        fontSize:24,
        color:'#000',
        alignSelf:'flex-start',
        marginTop:10,
        marginLeft:10,
        fontWeight:'bold'
    },
    clearButton: {
        fontSize: 20,
        color: 'red',
        marginRight:10,
        marginTop:10
    },  
    toggleButton:{
        width:25,
        height:25,
        borderRadius:20,
        borderWidth:2,
        borderColor:'#555',
        justifyContent:'center',
        alignItems:'center',
    },
    ON:{
        backgroundColor:'#0000ff'
    },    
});
