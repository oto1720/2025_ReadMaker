import React,{ useState,useEffect } from 'react';
import { Text,
    View,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    FlatList,
    SafeAreaView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Constants from 'expo-constants';

const API_KEY=Constants.expoConfig?.extra?.NEWS_APIKEY;
function WriteText() {
    const router = useRouter();
    const [titleBoxHeight, setTitleBoxHeight] = useState(40);
    const [textBoxHeight, setTextBoxHeight] = useState(40);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [howToShow, setHowToShow] = useState('normal');
    const [WPM, setWPM] = useState(300);
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
    function GameStart(){
        if(title.length<1){
            Alert.alert('タイトルを入力してください');
            return;
        }
        if(text.length<1){
            Alert.alert('文章を入力してください');
            return;
        }
        router.push('(tabs)/display?mode=input')
    }
    return (
        <ScrollView >
            <View>
                <View style={styles.writeScreen}>        
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>タイトル</Text>
                        <TouchableOpacity onPress={()=>{
                                setTitle('')  
                                setTitleBoxHeight(40)
                            }
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
                            fontSize: 18,
                            marginTop: 10 , 
                            borderRadius:5,
                            textAlignVertical: 'top',
                        }}
                        value={title}
                        placeholder="例) 竹取物語"
                        multiline
                        onChangeText={(title)=>setTitle(title)}
                        onContentSizeChange={(e)=>{
                            setTitleBoxHeight(e.nativeEvent.contentSize.height);
                        }}
                        />
                </View>
                <View style={styles.writeScreen}>
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>文章</Text>
                        <TouchableOpacity onPress={()=>{
                                setText('')
                                setTextBoxHeight(40)
                            }
                            }>
                            <Text style={styles.clearButton}>✖</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={{
                            height: Math.max(40, textBoxHeight),
                            backgroundColor: '#e8e8e8',
                            borderWidth: 0,
                            width: '100%',
                            fontSize:18,
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
                <View style={styles.writeScreen}>
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
               
                <View style={styles.writeScreen}>
                    
                        <Text style={styles.itemText}>読書速度</Text>
                        <View style={{
                        justifyContent:'space-between',
                        flexDirection:'row',
                    }}>
                        <Text style={{fontSize:15,marginLeft:10}}>遅い</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={100}
                            maximumValue={400}
                            minimumTrackTintColor="#8a46caff"
                            maximumTrackTintColor="#ffe4bcff"
                            thumbTintColor="#6565e7ff"
                            onValueChange={(WPM) => setWPM(Math.round(WPM))}
                        />
                        <Text style={{fontSize:15,marginRight:10}}>速い</Text>
                    </View>
                    <Text>{WPM}WPM</Text>
                    <View style={{flexDirection:'row',
                        marginTop:20,
                        marginLeft:10,
                    }}>
                        <View style={styles.expectView}>
                            <Text style={{fontSize:20,alignSelf:'center'}}>予想時間</Text>
                            <Text style={styles.expectText}>{Math.round(text.length/WPM)}分</Text>
                        </View>
                        <View style={styles.expectView}>
                            <Text style={{fontSize:20,alignSelf:'center'}}>難易度</Text>
                            <Text style={styles.expectText}>{GetDifficult(text.length)}</Text>
                        </View>
                    </View>
                    
                </View>
                <TouchableOpacity onPress={()=>GameStart()}>
                    <Text style={styles.startButton}>スタート</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function AozoraSelect() {
    type Article = {
  source: {
    id: string | null;
    name: string;
    };
  author: string | null;
  title: string;
  description: string;
  url: string;
  image_url: string | null;
  publishedAt: string;
  content: string;
    };
    
    const [seachWord,setSeachWord] =useState('');
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const url = `https://newsdata.io/api/1/news?apikey=pub_36db2c557766462dac0779c2e16416ac&language=ja&q=${seachWord}`;

    const router = useRouter();
    const [titleBoxHeight, setTitleBoxHeight] = useState(40);
    const [textBoxHeight, setTextBoxHeight] = useState(40);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [howToShow, setHowToShow] = useState('normal');
    const [WPM, setWPM] = useState(300);
    const [showNews, setShowNews] = useState(false);
    const [showNewsPlace, setShowNewsPlace] = useState(false);
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
    function GameStart(){
        if(title.length<1){
            Alert.alert('タイトルを入力してください');
            return;
        }
        if(text.length<1){
            Alert.alert('文章を入力してください');
            return;
        }
        router.push('app/display?mode=input')
    }
  function NewsPlace(){
    console.log("tomatotmato");
    return (
        <ScrollView >
            <View>
                <View style={styles.writeScreen}>        
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>タイトル</Text>
                        <TouchableOpacity onPress={()=>{
                                setTitle('')  
                                setTitleBoxHeight(40)
                            }
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
                            fontSize: 18,
                            marginTop: 10 , 
                            borderRadius:5,
                            textAlignVertical: 'top',
                        }}
                        value={title}
                        placeholder={selectedArticle? selectedArticle.title :''}
                        multiline
                        onChangeText={(title)=>setTitle(title)}
                        onContentSizeChange={(e)=>{
                            setTitleBoxHeight(e.nativeEvent.contentSize.height);
                        }}
                        />
                </View>
                <View style={styles.writeScreen}>
                    <View style={styles.itemView}>
                        <Text style={styles.itemText}>文章</Text>
                        <TouchableOpacity onPress={()=>{
                                setText('')
                                setTextBoxHeight(40)
                            }
                            }>
                            <Text style={styles.clearButton}>✖</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput style={{
                            height: Math.max(40, textBoxHeight),
                            backgroundColor: '#e8e8e8',
                            borderWidth: 0,
                            width: '100%',
                            fontSize:18,
                            marginTop: 10 , 
                            textAlignVertical: 'top',
                        }}
                        placeholder={selectedArticle? selectedArticle.description :''}
                        value={text}
                        onChangeText={(text)=>setText(text)}
                        multiline
                        onContentSizeChange={(e)=>{
                            setTextBoxHeight(e.nativeEvent.contentSize.height);
                        }}
                    >
                    </TextInput>
                </View>
                <View style={styles.writeScreen}>
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
               
                <View style={styles.writeScreen}>
                    
                        <Text style={styles.itemText}>読書速度</Text>
                        <View style={{
                        justifyContent:'space-between',
                        flexDirection:'row',
                    }}>
                        <Text style={{fontSize:15,marginLeft:10}}>遅い</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={100}
                            maximumValue={400}
                            minimumTrackTintColor="#8a46caff"
                            maximumTrackTintColor="#ffe4bcff"
                            thumbTintColor="#6565e7ff"
                            onValueChange={(WPM) => setWPM(Math.round(WPM))}
                        />
                        <Text style={{fontSize:15,marginRight:10}}>速い</Text>
                    </View>
                    <Text>{WPM}WPM</Text>
                    <View style={{flexDirection:'row',
                        marginTop:20,
                        marginLeft:10,
                    }}>
                        <View style={styles.expectView}>
                            <Text style={{fontSize:20,alignSelf:'center'}}>予想時間</Text>
                            <Text style={styles.expectText}>{Math.round(text.length/WPM)}分</Text>
                        </View>
                        <View style={styles.expectView}>
                            <Text style={{fontSize:20,alignSelf:'center'}}>難易度</Text>
                            <Text style={styles.expectText}>{GetDifficult(text.length)}</Text>
                        </View>
                    </View>
                    
                </View>
                <TouchableOpacity onPress={()=>GameStart()}>
                    <Text style={styles.startButton}>スタート</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

  const getArticles = async () => {
    try {
      const res = await axios.get(
        `${url}`
      );
      const filterRes=res.data.results.filter((article:Article)=>article.description!==null&&article.description.trim()!=='');
      setArticles(filterRes);
      setShowNews(true);
    } catch (error) {
      console.log(error);
    }
  };
    console.log(seachWord);
  return (
    <View style={{flexDirection:'column'}}>
        <View style={{flexDirection:'row'}}>
                <TextInput
                    placeholder='検索ワードを入力'
                    value={seachWord}
                    onChangeText={(text)=>setSeachWord(text)}
                >
                </TextInput>
                <TouchableOpacity onPress={() => getArticles()}>
                    <Text style={{borderWidth:1,borderColor:'#000',}}>検索</Text>
                </TouchableOpacity>
        </View>

        <FlatList
        data={articles}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={NewsPlace}>
            <Text>{item.title}</Text>
            {item.image_url && (
                <View style={{flexDirection:"row",width:'100%',justifyContent:'space-between',marginRight:10}}>
              <Image
                source={{ uri: item.image_url }}
                style={{ width: 200, height: 120 }}
              />
              <Text style={{width:'45%',marginLeft:10}}>{item.description}</Text>
                </View>
            )}
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.url} // idがないのでURLを使用
      />
         
    </View>
  )
};

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
        fontSize: 30,
        color: '#fff',
        fontWeight: 'bold',
        marginTop:15
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
        shadowRadius:5,
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
    slider:{
        width: '80%',
        height: 20,
        backgroundColor: '#f1bcbc',
        borderRadius: 20,
        marginTop: 10,
    },
    expectView:{
        alignItems:'flex-start',
        flexDirection:'column',
        marginVertical:20,
        marginHorizontal:10,
        justifyContent:'flex-end',
        backgroundColor:'#ffffff',
        padding: 20,
        borderRadius:20,
        shadowColor:'#000',
        shadowOffset:{width:1,height:2},
        shadowRadius:5,
        elevation:9,
    },
    expectText:{
        fontSize: 50,
    },
    startButton:{
        color: '#ffffff',
        fontSize: 30,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    }
});
