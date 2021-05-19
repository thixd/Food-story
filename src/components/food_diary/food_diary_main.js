import React, {useState, useEffect} from 'react'
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import AsyncSelect from "react-select/async"
import './food_diary.css'
import Grid from "@material-ui/core/Grid"
import ButtonBase from "@material-ui/core/ButtonBase"
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
                <img src={map[0]} key={map[1]} class="diary_image"/>
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
    return <ButtonBase class="diary_image">
    <input type="file" onChange={upload} accept="image/*" id="upload_btn" style={{opacity:"0%"}}/>
    </ButtonBase>      

}

export default function DiaryMain(){

    const [uid, setuid] = useState("sample_uid")

    return (
        <Grid container spacing={2}>
            <Grid item lg={12}>
                <AppNavBar/>
            </Grid>
            <Grid item lg={1}>
                <div>Filter by</div>
            </Grid>
            <Grid item lg={2}>
                <div style={{width: '300px'}}>{FBSelect(uid +'/locations')}</div>
            </Grid>
            <Grid item lg={2}>
                <div style={{width: '300px'}}>{FBSelect(uid +'/origins')}</div>
            </Grid>
            <Grid item lg={12}>
                <div id="diary_box">
                    {Upload_file()}
                    <Renderer/>
                </div>
            </Grid>
        </Grid>
    )
}