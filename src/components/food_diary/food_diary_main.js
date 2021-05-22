import React, {useState, useEffect, createContext} from 'react'
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
    {value:"Dajeon", label:"Dajeon"},
    {value:"Seoul", label:"Seoul"}
])

firebase.database().ref(uid +'/origins').set([
    {value:"Korean", label:"Korean"},
    {value:"Italian", label:"Italian"}
])

firebase.storage().ref().child(uid)
firebase.storage().ref(uid).child('images')


const SelectionContext = createContext(null)

function FBSelect(arg, setter) {
    const loadOptions = () => {
        return firebase.database().ref(uid+arg).once('value').then((snapshot => {
            return snapshot.val()
        }))
    }
    function handleChange(e){
        setter(e["value"])
    }
    return <AsyncSelect id={'select'+arg} defaultOptions loadOptions={loadOptions} onChange={handleChange}></AsyncSelect>
}


function Renderer(Selection){
    const [urls, seturls] = useState([])
    console.log(Selection)

    useEffect(() => {
        firebase.database().ref(uid).get().then((snapshot) =>{
            const maps = Object.keys(snapshot.val()['feeds']).map((key) =>{
                return [snapshot.val()['feeds'][key]['image'], key]
            })
            seturls(maps)
        })
    }, [])

    useEffect(() => {
        alert(Selection)
    }, [Selection])

    if (urls===[]) return null
    return urls.map(map => (
            <img src={map[0]} key={map[1]} className="diary_image"/>
        ))  
}


//Upload file
function Upload_file(){
    const [file, setfile] = useState(null)
    useEffect(() => {
        if (file==null) return
        const feedkey_list = String(firebase.database().ref('/feeds/').push()).split('/')
        const feedkey = feedkey_list[feedkey_list.length -1]
        const imgref = firebase.storage().ref().child(uid).child('images').child(feedkey)
        imgref.put(file).then(() => {
            alert("file uploaded")
        }).then(() => {
            firebase.storage().ref().child(uid).child('images').child(feedkey).getDownloadURL().then((value) =>{
                firebase.database().ref('/feeds/'+feedkey+'image').set(value)
                firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(value)
            })
        })
    }, [file])
    const upload = (e) => {
        setfile(tmp => e.target.files[0])
    }
    return <div style={{gridRow:1/1, gridColumn:1/1}}>
        <input type="file" onChange={upload} accept="image/*" id="upload_btn" style={{display:"none"}}/>
        <label htmlFor="upload_btn" style={{marginLeft:"20%"}}>
            <IconButton aria-label="addaphoto" component="span">
                <AddAPhotoIcon style={{fontSize:"50"}}/>
            </IconButton>  
        </label>
    </div>
    
}


document.addEventListener('click', (e) => {
    if (e.target.className === "diary_image"){
        alert("clicked!")
    }
    else if (e.target.id === "select_locations"){

    }
    else if (e.target.id === "select_origins"){

    }
})

export default function DiaryMain(){

    const [uid, setuid] = useState("sample_uid")
    const [Selection, setSelection] = useState(null)
    return (
        <SelectionContext.Provider value={{Selection, setSelection}}>
            <div>
                <AppNavBar/>
                <div style={{display:"grid", gridTemplateColumns:"7fr 1fr 2fr 2fr"}}>
                    <div></div>
                    <div style={{textAlign:'right', paddingTop:"7px"}}>Filter by: </div>
                    <div>{FBSelect('/locations',setSelection)}</div>
                    <div>{FBSelect('/origins', setSelection)}</div>
                </div>

                <div className="container">
                    <div id="diary_grid">
                        {Upload_file(Selection)}
                        {Renderer(Selection)}
                    </div>

                </div>
            </div>
        </SelectionContext.Provider>
    )
}