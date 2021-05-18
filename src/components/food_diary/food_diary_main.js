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

firebase.database().ref(uid+'feeds')

function FBSelect(arg) {
    const loadOptions = () => {
        return firebase.database().ref(arg).once('value').then((snapshot => {
            return snapshot.val()
        }))
    }
    return <AsyncSelect defaultOptions loadOptions={loadOptions}></AsyncSelect>
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
            <div> This is diary main </div>
        </>
    )
}