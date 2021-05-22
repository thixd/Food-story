import React, {useState, useEffect} from 'react'
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import AsyncSelect from "react-select/async"
import './food_diary.css'
import IconButton from "@material-ui/core/IconButton"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
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
        if (this.state.urls===[]) return Upload_file()
        console.log("Asdf")

        return this.state.urls.map(map => (
                <img src={map[0]} key={map[1]} className="diary_image"/>
            ))      
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
    return <div style={{gridRow:1/1, gridColumn:1/1}}>
        <input type="file" onChange={upload} accept="image/*" id="upload_btn" style={{display:"none"}}/>
        <label htmlFor="upload_btn" style={{marginLeft:"25%"}}>
            <IconButton aria-label="addaphoto" component="span">
                <AddAPhotoIcon style={{fontSize:"50"}}/>
            </IconButton>  
        </label>
    </div>
    
}

export default function DiaryMain(){

    const [uid, setuid] = useState("sample_uid")

    return (
        <div>
            <AppNavBar/>
            <div style={{float:"right"}}>Filter by</div>
            <div>{FBSelect(uid +'/locations')}</div>
            <div>{FBSelect(uid +'/origins')}</div>
            <div className="container">
                <div id="diary_grid">
                    {Upload_file()}
                    <Renderer/>
                </div>

            </div>
        </div>
    )
}