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


function Render_pictures(uid) {
    firebase.database().ref(uid+"/feeds/").get().then((snapshot) =>{
        console.log(Object.keys(snapshot.val()))
    })

}

function Render_each(feed){
    function getImage(feed){
        var imgkey = firebase.storage().ref(uid+'/feeds/'+feed+'/image').once('value').then(snapshot =>{
            return snapshot.val()
        })
        return firebase.database().ref(uid+'/images/'+imgkey).get().then(snapshot => {return snapshot.val()})
    }
    return <div style={{height:"50px", width:"50px"}}><img src={getImage(feed)}/></div>
}


//Upload file
function Upload_file(){
    const [file, setfile] = useState(null)
    useEffect(() => {
        if (file==null) return
        const feedkey_list = String(firebase.database().ref(uid+'/feeds/').push()).split('/')
        const feedkey = feedkey_list[feedkey_list.length -1]
        const imgref = firebase.storage().ref(uid+'/images/').child(feedkey)
        imgref.put(file).then(() => {alert("file uploaded")})
        firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(imgref.fullPath)
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
            <div style={{width:"500px", height:"500px", border:"1px solid black"}}>
                <span style={{width:"50px", height:"50px"}}></span>
            </div>
            {Upload_file()}
            {Render_pictures(uid)}
            <div> This is diary main </div>
        </>
    )
}