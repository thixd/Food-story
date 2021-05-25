import React, {useState, useEffect, createContext, useRef} from 'react'
import AppNavBar from '../../utils/app_bar'
import firebase from '../../firebase'
import AsyncSelect from "react-select/async"
import mapboxgl from 'mapbox-gl'
import {useHistory} from 'react-router-dom'
import 'mapbox-gl/dist/mapbox-gl.css'
import './food_diary.css'
import IconButton from "@material-ui/core/IconButton"
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto"
import ShareIcon from '@material-ui/icons/Share'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
//import UID

mapboxgl.accessToken = "pk.eyJ1Ijoic3Rhcm1wY2MiLCJhIjoiY2tvM25tN3prMDhkZTJvbm1ndGdpZ29wdiJ9.UNImIqbOG-IOXPZgqM5GwQ"

//Sample variables for test
const uid = "sample_uid"
firebase.database().ref(uid +'/locations/Dajeon/-Ma49Ikizf3-0Km6ouME').set("https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/sample_uid%2Fimages%2F-Ma49Ikizf3-0Km6ouME?alt=media&token=55d3c26a-37ee-4de3-bab2-799d59a164e5")

firebase.database().ref(uid +'/origins/Korean/-Ma49Ikizf3-0Km6ouME').set("https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/sample_uid%2Fimages%2F-Ma49Ikizf3-0Km6ouME?alt=media&token=55d3c26a-37ee-4de3-bab2-799d59a164e5")



firebase.storage().ref().child(uid)
firebase.storage().ref(uid).child('images')


const SelectionContext = createContext(null)

function LocSelect(setter){
    const loadOptions = () => {
        return firebase.database().ref(uid+'/locations').once('value').then((snapshot => {
            return Object.keys(snapshot.val()).map(map =>{
                return {value:map, label:map}
            })
        }))
    }
    function handleChange(e){
        setter(e["value"])
    }
    return <AsyncSelect id={'select_location'} defaultOptions loadOptions={loadOptions} onChange={handleChange} defaultInputValue="Location"></AsyncSelect>
}

function OrgSelect(setter){
    const loadOptions = () => {
        return firebase.database().ref(uid+'/origins').once('value').then((snapshot => {
            return Object.keys(snapshot.val()).map(map =>{
                return {value:map, label:map}
            })
        }))
    }
    function handleChange(e){
        setter(e["value"])
    }
    return <AsyncSelect id={'select_origin'} defaultOptions loadOptions={loadOptions} onChange={handleChange} defaultInputValue="Origin"></AsyncSelect>
}


function Renderer(loc, org, setselectedImage){
    const [urls, seturls] = useState([])
    useEffect(() => {
        if (urls.length !== 31){
            var tmp = urls.slice()
            while (tmp.length!==31){
                tmp.push(null)
            }
            seturls(tmp)
        }
    }, [urls])
    useEffect(() => {
        firebase.database().ref(uid).get().then((snapshot) =>{
            const maps = Object.keys(snapshot.val()['feeds']).map((key) =>{
                return [snapshot.val()['feeds'][key]['image'], key]
            })
            if (maps.length !== 31){
                var tmp = maps.slice()
                while (tmp.length!==31){
                    tmp.push(null)
                }
            }
            seturls(maps)
        })
        
    }, [])

    useEffect(() => {
        console.log(loc)
        console.log(org)
        if (loc!=null){
            firebase.database().ref(uid).child('locations').child(loc).get().then((snapshot) =>{
                const maps = Object.keys(snapshot.val()).map((key) => {
                    return [snapshot.val()[key], key]
                })
                seturls(maps)
            })
        }
        if (org!=null){
            firebase.database().ref(uid).child('origins').child(org).get().then((snapshot) =>{
                const maps = Object.keys(snapshot.val()).map((key) => {
                    return [snapshot.val()[key], key]
                })
                var tmp = urls.slice()
                var res = []
                for (var i=0; i<maps.length;i++){
                    for (var j=0; j<tmp.length; j++){
                        console.log(maps)
                        console.log(tmp)
                        if (tmp[j]!==null && maps[i][0]===tmp[j][0]) res.push(maps[i])
                    }
                }
                seturls(res)
            })
        }
    }, [loc, org])

    function imageClick(e){
        setselectedImage(e["target"])
    }

    if (urls===[]) return null

    return urls.map(map => {
        if (map!=null){
            return (<div>
                    <img src={map[0]} id={map[1]} className="diary_image" alt="" onClick={imageClick}/>
                </div>
            )
        }
        else{
            return (<div><div className="diary_fill"></div></div>)
        }
    }) 
}



function DiaryOverlay(selectedImage){
    const [lng, setlng] = useState(127.36252)
    const [lat, setlat] = useState(36.37036)
    const [zoom, setzoom] = useState(12)
    const overlayref = useRef(null)
    const mapRef = useRef(null)
    const map = useRef(null)


    useEffect(() => {
        if (map.current) return
        map.current = new mapboxgl.Map({
            container: mapRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom
        })
    }, [])
    useEffect(() => {
        if (selectedImage===null) return null
        firebase.database().ref('/Feeds/'+selectedImage.id).get().then((snapshot) =>{
            document.querySelector('#overlay_image').src = selectedImage.src 
            document.querySelector('#overlay_location').textContent = snapshot.val()['location']
            document.querySelector('#overlay_origin').textContent = snapshot.val()['origin']
            //map.current.setCenter([snapshot.val()['lng'], snapshot.val()['lat']])
        })
    }, [selectedImage])

    const history = useHistory()
    function share(){
        //do_something
        var prop = {'BoxProps': {'val': {image:document.getElementById('overlay_image').src, 'user': uid},
                'feedkey': selectedImage.id
        }}

        history.push({
            pathname:'/single_post'
        })
    }
    return (
        <div id="diary_overlay" style={{display:"none"}} ref={overlayref}>
            <IconButton id="overlay_share" component="span" onClick={share}>
                <ShareIcon style={{fontSize:"30"}}/>
            </IconButton>
            <img id="overlay_image" alt=""></img>

            <div style={{paddingLeft:"50px", justifySelf:"left"}}>Location</div>
            <div id="overlay_location" style={{paddingRight:"50px", justifySelf:"right"}}></div>
            <div style={{paddingLeft:"50px", justifySelf:"left"}}>Origin</div>
            <div id="overlay_origin" style={{paddingRight:"50px", justifySelf:"right"}}></div>
            <div ref={mapRef} className="map"></div>

        </div>
    )
}


//Upload file
function Upload_file(){
    const [file, setfile] = useState(null)
    useEffect(() => {
        if (file==null) return
        const feedkey_list = String(firebase.database().ref('/Feeds/').push()).split('/')
        const feedkey = feedkey_list[feedkey_list.length -1]
        const imgref = firebase.storage().ref().child(uid).child('images').child(feedkey)
        imgref.put(file).then(() => {
            alert("file uploaded")
        }).then(() => {
            firebase.storage().ref().child(uid).child('images').child(feedkey).getDownloadURL().then((value) =>{
                firebase.database().ref('/Feeds/'+feedkey+'image').set(value)
                firebase.database().ref(uid+'/Feeds/'+feedkey+"/image").set(value)
            })
        })
    }, [file])
    const upload = (e) => {
        setfile(tmp => e.target.files[0])
    }
    return (
        <div style={{gridRow:1/1, gridColumn:1/1}}>
        <input type="file" onChange={upload} accept="image/*" id="upload_btn" style={{display:"none"}}/>
        <label htmlFor="upload_btn">
            <IconButton aria-label="addaphoto" component="span">
                <AddAPhotoIcon style={{fontSize:"50"}}/>
            </IconButton>  
        </label>
        </div>
    );
    
}

document.addEventListener('click', (e) => {
    if (document.getElementById("diary_overlay")==null) return
    if (document.getElementById("diary_overlay").style.display === "grid" &&
        !document.getElementById("diary_overlay").contains(e.target)){
        document.getElementById("diary_overlay").style.display = "none"
    }
    else if (e.target.className === "diary_image"){
        document.getElementById("diary_overlay").style.display = "grid"
        document.addEventListener('click', (e))
    }
})

export default function DiaryMain(){
    const [loc, setloc] = useState(null)
    const [org, setorg] = useState(null)
    const [selectedImage, setselectedImage] = useState(null)
    return (
        <SelectionContext.Provider value={{loc, setloc, org, setorg, selectedImage, setselectedImage}}>
            <div>
                <AppNavBar/>
                <div style={{display:"grid", gridTemplateColumns:"5fr 2fr 1fr 2fr 2fr", paddingTop:"10px", paddingBottom:"20px"}}>
                    <div></div>
                    <div style={{textAlign:"center", fontSize:"40px"}}><ArrowLeftIcon/>May 2021<ArrowRightIcon/></div>
                    <div style={{textAlign:'right', paddingTop:"7px"}}>Filter by: </div>
                    <div>{LocSelect(setloc)}</div>
                    <div>{OrgSelect(setorg)}</div>
                </div>

                <div className="container">
                    <div id="diary_grid">
                        {Upload_file()}
                        {Renderer(loc, org, setselectedImage)}
                    </div>
                </div>
                {DiaryOverlay(selectedImage)}
            </div>
        </SelectionContext.Provider>
    )
}