import React, {useState, useEffect} from 'react'
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import AsyncSelect from "react-select/async"
//import UID

//Sample variables for test
const uid = "sample_uid"
firebase.database().ref(uid +'/locations').set([
    {value:"value", label:"label"},
    {value:"asdf", label:"asdf"}
])

firebase.database().ref(uid +'/origins').set([
    {value:"Korean", label:"Korean"},
    {value:"Italian", label:"Italian"}
])

firebase.storage().ref().child(uid)
firebase.storage().ref(uid).child('images')

function FBSelect(arg) {
    const loadOptions = () => {
        return firebase.database().ref(arg).once('value').then((snapshot => {
            return snapshot.val()
        }))
    }
    return <AsyncSelect defaultOptions loadOptions={loadOptions}></AsyncSelect>
}



class Renderer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            urls:[]
        }
    }

    componentDidMount(){
        firebase.database().ref(uid+"/feeds/").get().then((snapshot) =>{
            const maps = Object.keys(snapshot.val()).map((key) =>{
                return [snapshot.val()[key]['image'], key]
            })
            this.setState({urls:maps})
        })
    }

    render(){
        if (this.state.urls===[]) return <div></div>
        console.log("Asdf")

        return <div>
            {this.state.urls.map(map => (
                <img src={map[0]} key={map[1]} style={{width:"100px", height:"100px"}}/>
            ))}
            </div>
        
    }
}



//Upload file
function Upload_file(){
    const [file, setfile] = useState(null)
    useEffect(() => {
        if (file==null) return
        const feedkey_list = String(firebase.database().ref(uid+'/feeds/').push()).split('/')
        const feedkey = feedkey_list[feedkey_list.length -1]
        const imgref = firebase.storage().ref().child(uid).child('images').child(feedkey)
        imgref.put(file).then(() => {
            alert("file uploaded")
        }).then(() => {
            firebase.storage().ref().child(uid).child('images').child(feedkey).getDownloadURL().then((value) =>{
                firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(value)
            })
        })

        
    }, [file])
    const upload = (e) => {
        setfile(tmp => e.target.files[0])
    }
    return <div>
        <input type="file" onChange={upload}/>
    </div>
}

export default function DiaryMain(){

    const [uid, setuid] = useState("sample_uid")

    return (
        <>
            <AppNavBar/>
            <div>
                <div>Filter by</div>
                <div style={{width: '300px'}}>{FBSelect(uid +'/locations')}</div>
                <div style={{width: '300px'}}>{FBSelect(uid +'/origins')}</div>
            </div>
            <div id="diary_box" style={{width:"500px", height:"500px", border:"1px solid black"}}>
                <Renderer/>
            </div>

            {Upload_file()}
            <div> This is diary main </div>
        </>
    )
}