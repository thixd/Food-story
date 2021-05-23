import React, {useState, useEffect, createContext, useRef} from 'react'
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import AsyncSelect from "react-select/async"
import './food_diary.css'
import IconButton from "@material-ui/core/IconButton"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import CloseIcon from '@material-ui/icons/Close'
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


function Renderer(Selection, setselectedImage){
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

    function imageClick(e){
        setselectedImage(e["target"])
    }

    if (urls===[]) return null
    return urls.map(map => (
        <div>
            <img src={map[0]} id={map[1]} className="diary_image" onClick={imageClick}/>
        </div>
        ))  
}

function DiaryOverlay(selectedImage){
    const overlayref = useRef(null)

    useEffect(() => {
        if (selectedImage===null) return null
        firebase.database().ref('/Feeds/'+selectedImage.id).get().then((snapshot) =>{
            document.querySelector('#overlay_image').src = selectedImage.src 
            document.querySelector('#overlay_location').textContent = snapshot.val()['location']
            document.querySelector('#overlay_origin').textContent = snapshot.val()['origin']

        })
    }, [selectedImage])

    
    function close(){
        document.getElementById("diary_overlay").style.display = "none"
    }
    return (
        <div id="diary_overlay" style={{display:"none"}} ref={overlayref}>
            <IconButton id="overlay_close" component="span" onClick={close}>
                <CloseIcon style={{fontSize:"50"}}/>
            </IconButton>
            <img id="overlay_image"></img>

            <div>Location</div>
            <div id="overlay_location"></div>
            <div>Origin</div>
            <div id="overlay_origin"></div>
        </div>
    )
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
        <label htmlFor="upload_btn">
            <IconButton aria-label="addaphoto" component="span">
                <AddAPhotoIcon style={{fontSize:"50"}}/>
            </IconButton>  
        </label>
    </div>
    
}

document.addEventListener('click', (e) => {

    if (e.target.className === "diary_image"){
        document.getElementById("diary_overlay").style.display = "grid"
        document.addEventListener('click', (e))
    }
    else if (document.getElementById("diary_overlay").style.display === "grid" &&
        !document.getElementById("diary_overlay").contains(e.target)){
        document.getElementById("diary_overlay").style.display = "none"

    }

})

export default function DiaryMain(){

    const [uid, setuid] = useState("sample_uid")
    const [Selection, setSelection] = useState(null)
    const [selectedImage, setselectedImage] = useState(null)
    return (
        <SelectionContext.Provider value={{Selection, setSelection, selectedImage, setselectedImage}}>
            <div>
                <AppNavBar/>
                <div style={{display:"grid", gridTemplateColumns:"7fr 1fr 2fr 2fr", paddingTop:"10px"}}>
                    <div></div>
                    <div style={{textAlign:'right', paddingTop:"7px"}}>Filter by: </div>
                    <div>{FBSelect('/locations',setSelection)}</div>
                    <div>{FBSelect('/origins', setSelection)}</div>
                </div>

                <div className="container">
                    <div id="diary_grid">
                        {Upload_file(Selection)}
                        {Renderer(Selection, setselectedImage)}
                    </div>
                </div>
                {DiaryOverlay(selectedImage)}
            </div>
        </SelectionContext.Provider>
    )
}