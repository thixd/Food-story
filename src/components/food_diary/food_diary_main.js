import React, {useState, useEffect, createContext, useRef, Component} from 'react'
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
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
//import UID

mapboxgl.accessToken = "pk.eyJ1Ijoic3Rhcm1wY2MiLCJhIjoiY2tvM25tN3prMDhkZTJvbm1ndGdpZ29wdiJ9.UNImIqbOG-IOXPZgqM5GwQ"

//Sample variables for test
const uid = "sample_uid"
firebase.database().ref(uid +'/locations/Daejeon/-Ma49Ikizf3-0Km6ouME').set("https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/sample_uid%2Fimages%2F-Ma49Ikizf3-0Km6ouME?alt=media&token=55d3c26a-37ee-4de3-bab2-799d59a164e5")

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
        firebase.database().ref(uid).on('value', snapshot => {
        const maps = Object.keys(snapshot.val()['feeds']).map((key) =>{
            return [snapshot.val()['feeds'][key], key]
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
        // firebase.database().ref(uid).get().then((snapshot) =>{
        //     if(typeof(snapshot.val()['feeds']) == "undefined")
        //         return;
        //     const maps = Object.keys(snapshot.val()['feeds']).map((key) =>{
        //         return [snapshot.val()['feeds'][key]['image'], key]
        //     })
        //     if (maps.length !== 31){
        //         var tmp = maps.slice()
        //         while (tmp.length!==31){
        //             tmp.push(null)
        //         }
        //     }
        //     seturls(maps)
        // })
        
    // }, [])

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
            return (
                <div >
                    <div style = {{display: 'flex', justifyContent:'center', alignItems:'center', paddingBottom: 5}}> 
                        <img src={map[0]['image']} id={map[1]} style = {{width: 90, height: 90}} className="diary_image" alt="" onClick={imageClick}/>
                    </div>
                    <div style = {{display: 'flex', justifyContent:'center', alignItems:'center'}}> {map[0]['createAt']} </div>
                </div>
            )
        }
        else{
            var white_plate = "https://firebasestorage.googleapis.com/v0/b/foodstory-c6226.appspot.com/o/static%2Fwhite_plate.jpg?alt=media&token=4ab38285-4bd3-4ce9-84b8-2c27f295afcc"
            return(
                <div style = {{display: 'flex', justifyContent:'center', alignItems:'center'}} >
                    <Avatar style={{ height: '100px', width: '100px' }} alt="" src= {white_plate}/>
                </div>
            )
            // return (<div><div className="diary_fill"></div></div>)
        }
    }) 
}

var curUser = "testingUser";

class SharingOverlay extends Component {
    constructor(props){
        super(props)
        this.state = {
            image: this.props.link,
            user: curUser,
            comments: [{"name": "null", "text": "null"}],
            reactions: {"0": "null"},
            isPrivate: true,
            location: "Daejon",
            origin: "Origin",
            lat: 0,
            lng: 0,
            hashtags: {"0": "null"},
            text: "",
            time: "1min",
            getData: false,
        }
    }
    render() {
        return(
            <img id="overlay_image" alt=""></img>
        )
    }

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
        firebase.database().ref(uid + '/feeds/'+selectedImage.id).get().then((snapshot) =>{
            document.querySelector('#overlay_image').src = selectedImage.src 
            document.querySelector('#overlay_location').textContent = snapshot.val()['location']
            document.querySelector('#overlay_origin').textContent = snapshot.val()['origin']
            // map.current.setCenter([90, 90])
        })
    }, [selectedImage])

    const history = useHistory()
    function share(){
        //do_something
        var prop = {'src': selectedImage.src, 'user': uid}

        history.push({
            pathname:'/sharing-post',
            state: {src: selectedImage.src, name: uid}
        })
    }
    return (
        <div id="diary_overlay" style={{display:"none"}} ref={overlayref}>
            <IconButton id="overlay_share" component="span" onClick={share}>
                <p>Share</p>
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
function Upload_file(file, setfile, setProgress){
    useEffect(() => {
        if (file==null) return
        const feedkey_list = String(firebase.database().ref('/Feeds/').push()).split('/')
        const feedkey = feedkey_list[feedkey_list.length -1]
        const imgref = firebase.storage().ref().child(uid).child('images').child(feedkey)
        var uploadTask = imgref.put(file)
        uploadTask.on('state_changed', function(snapshot){
            var curProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(curProgress);
            setProgress(curProgress);
        }, function(error) {
            alert("Cannot upload!")
        }, function(){
            var currentdate = new Date();
            firebase.storage().ref().child(uid).child('images').child(feedkey).getDownloadURL().then((value) =>{
                // firebase.database().ref('/Feeds/'+feedkey+'/image').set(value)
                firebase.database().ref(uid+'/feeds/'+feedkey+"/image").set(value)
                // firebase.database().ref('/Feeds/'+feedkey+'/origin').set("Korea")
                firebase.database().ref(uid+'/feeds/'+feedkey+"/origin").set("Korea")
                // firebase.database().ref('/Feeds/'+feedkey+'/location').set("Daejon")
                firebase.database().ref(uid+'/feeds/'+feedkey+"/location").set("Daejeon")
                firebase.database().ref(uid+'/feeds/'+feedkey+"/createAt").set(currentdate.toDateString())
            })
            setProgress(0)
            setfile(null)
            alert("Image has successfully uploaded!")
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

function LinearProgressWithLabel(props) {
    return (
      <Box style = {{width : 1050}} display="flex" justifyContent="center">
        <Box width="100%" mr={1}>
          <LinearProgress 
            variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

export default function DiaryMain(){
    const [loc, setloc] = useState(null)
    const [org, setorg] = useState(null)
    const [selectedImage, setselectedImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [file, setfile] = useState(null)
    return (
        <>
        <SelectionContext.Provider value={{loc, setloc, org, setorg, selectedImage, setselectedImage}}>
            <div>
                <AppNavBar/>
                <div style={{display:"grid", gridTemplateColumns:"5fr 2fr 1fr 2fr 2fr", paddingTop:"10px", paddingBottom:"20px"}}>
                    <div></div>
                    <div style={{textAlign:"center", fontSize:"40px", paddingTop: 30}}><ArrowLeftIcon/>May 2021<ArrowRightIcon/></div>
                    <div style={{textAlign:'right', paddingTop:"7px", paddingRight: 20}}>Filter by: </div>
                    <div style={{paddingRight: 20}}>{LocSelect(setloc)}</div>
                    <div style={{paddingRight: 20}}>{OrgSelect(setorg)}</div>
                </div>

                <div className="container">
                    <div id="diary_grid">
                        {Upload_file(file, setfile, setProgress)}
                        {Renderer(loc, org, setselectedImage)}
                    </div>
                </div>
                {DiaryOverlay(selectedImage)}
                {/* <SharingOverlay/> */}
            </div>
        </SelectionContext.Provider>

        <div style = {{display: 'flex', justifyContent:'center', alignItems:'center', paddingTop:10, paddingBottom:20}}>
            { file == null ? (<div></div>) : (
            <LinearProgressWithLabel value={progress} />
            )}
        </div>
        </>
    )
}