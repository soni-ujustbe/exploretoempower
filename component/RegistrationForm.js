import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import firebaseApp from '../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc, updateDoc, query, Timestamp } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Link from 'next/link'
import Header from "../component/module/Header"

const db = getFirestore();

//Image import
import topbannerimg from '../public/images/topbanner.png';
import walogo from '../public/images/whatsapp.png'




const threecheckdata = [
    { name: "Contributor" },
    { name: "Selfless" },
    { name: "Integrity" },
    { name: "Authenticity" },   
];





const RegistrationForm = ()=> {
    const [phoneNum, setphoneNum] = useState('')
    const [username, setusername] = useState('')
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [singleUsers, setsingleUsers] = useState('');
    const [singleAdminUsers, setsingleAdminUsers] = useState('');

    // questions state

    const [onecheck, setoneCheck] = useState('');
    const [twocheck, setTwoCheck] = useState("");
    const [threecheck, setThreeCheck] = useState(threecheckdata);
    const [fourcheck, setFourCheck] = useState("");
    const [fivecheck, setFiveCheck] = useState("");
    const [sixcheck, setSixCheck] = useState("");
   
    const [showInputTwo, setShowInputTwo] = useState(false);

    const [oneQuestionInput, setOneQuestionInput] = useState("");
    const [twoQuestionInput, setTwoQuestionInput] = useState("");
 


    const [UserData, setUserData] = useState([]);
    const [userId, setuserId] = useState('');
    const [error, seterror] = useState(false);
    const [formsubmit, setformsubmit] = useState(false);
    const [formbgImage, setformbgImage] = useState('');
    const [mobileFormbg, setmobileFormbg] = useState('')
    const [eventName, seteventName] = useState('');

    // condition for input
 
 
    const [whatsappgroup, setwhatsappgroup] = useState("");


  //function for add data in firebase
  const HandleSubmitForm = async (event) => {
    event.preventDefault();

    const isLogin = localStorage.getItem("ucore");
    const usersDetails = JSON.parse(isLogin);
    console.log(usersDetails);

    const data = {
        username: username,
        phoneNum: phoneNum,
        PreOneAns: onecheck,
        preOneInput: oneQuestionInput,
        PreTwoAns: twocheck,
        preTwoInput:twoQuestionInput,
        PreThreeAns: threecheck,
        PreFourAns: fourcheck, 
        PreFiveAns: fivecheck,    
        PreSixAns: sixcheck, 
        preFormSubmit: true,
        createdBy:Timestamp.now(),

    };

    //if user empty throw error else merge the form data in firebase
    if (onecheck==="" || twocheck==="" || threecheck==="" || fourcheck==="" || fivecheck==="" || sixcheck==="" )
    {
        seterror(true);
        
        
        setThreeCheck(threecheckdata);
    }
    else {

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        setformbgImage();
        const docRef = doc(db, usersDetails.eventName, phoneNum);
        await setDoc(docRef, data, { merge: true });

        // const docSnap = await getDoc(docRef);
        console.log("Form data", data);
        setformsubmit(true);

    };

    // clear all field after submit the data
    setoneCheck("");
    setOneQuestionInput("");
    setTwoCheck("");
    setTwoQuestionInput("");
    setThreeCheck(threecheck);
    setFourCheck("");
    setFiveCheck("");
    setSixCheck("");



}

    //target checked data for store in firestore
    const questionOne = (event) => {
        const target = event.target;
        if (target.checked) {
            setoneCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionTwo = (e) => {
        const target = event.target;
        if (target.checked) {
            setTwoCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionThree = (event) => {
        const {name,checked}= event.target;
            let tempThreeData=threecheck.map((threedetails)=>
            threedetails.name === name ? { ...threedetails, isChecked:checked } : threedetails);
            setThreeCheck(tempThreeData);
    
            console.log("threequestion",threecheck);        
    };

    const questionFour = (event) => {
        const target = event.target;
        if (target.checked) {
            setFourCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionFive = (event) => {
        const target = event.target;
        if (target.checked) {
            setFiveCheck(target.value);
            console.log(event.target.value);
        }

    };

    
    const questionSix = (event) => {
        const target = event.target;
        if (target.checked) {
            setSixCheck(target.value);
            console.log(event.target.value);
        }

    };
  

    useEffect(() =>{
        setThreeCheck(threecheckdata);

    },[])  

useEffect(() => {
    const isLogin = localStorage.getItem("ucore");
    const usersDetails = JSON.parse(isLogin);
    console.log(usersDetails);


    console.log(usersDetails.username);
    console.log(usersDetails.phoneNum);
    setusername(usersDetails.username);
    setphoneNum(usersDetails.phoneNum);
    seteventName(usersDetails.eventName);

    const eventName = usersDetails.eventName;

    console.log(eventName);


    setLoading(true);

    // if(preFormSubmit){

    // Router.push("/dashboard");

    // }else{

    // }

    const getsingleDoc = async () => {

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);
        const FormEventName = usersDetails.eventName;
        const FormPhoneNumber = usersDetails.phoneNum;


        const docRef = doc(db, FormEventName, FormPhoneNumber);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());

        if (docSnap.exists()) {
            setsingleUsers(docSnap.data());
            console.log(singleUsers);
            console.log("Document data:", docSnap.data());
            const prefillformsubmit = docSnap.data().preFormSubmit;
            if (prefillformsubmit) {

                Router.push("/dashboard");
            } else {

                // alert("kindly fill the form");
            }


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }

    }

    const getSingleAdminDoc = async () => {

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

        const docRef = doc(db, "AdminMonthlyMeet", eventName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setsingleAdminUsers(docSnap.data());
            console.log(singleAdminUsers);
            console.log("Admin Document data:", docSnap.data());
            //   console.log("Admin Document data:", docSnap.data().formimage);
            setformbgImage(docSnap.data().formImgUrls);
            setmobileFormbg(docSnap.data().mobileUrls);
            setwhatsappgroup(docSnap.data().whatsappLink);
            seteventName(docSnap.data().eventName);
            console.log(docSnap.data().whatsappLink);

            console.log(eventName);

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }



    }
    // getContent();
    getsingleDoc();
    getSingleAdminDoc();
}, []);

  return (
    <>

         <Header/>

        <section className="c-containerForm">

    <div className='topbanner'>
        <img className='desktopFormbg' src={formbgImage} />
        <img className='mobileFormbg' src={mobileFormbg} />

      
        {/* <Image src={topbannerimg} placeholder="blur" alt='logo' /> */}
        <div className="bannertext">
            <h1>{eventName}</h1>
        </div>
    </div>



    {/* form start  */}

    {
        formsubmit ?
            <div className="sucess">
                <h2> Thank you for sharing your responses.</h2>
                <h4> Kindly join the WhatsApp Group </h4>
                <div className='whatsappLink'>
                    <div className='walogo'>
                        <Image src={walogo} layout='responsive' />
                    </div>
                    <Link href={whatsappgroup} ><a className="whatsappbtn">Join WhatsApp Group</a></Link>
                </div>
                <Link href="/dashboard" ><a className="homelink">Go back to home to get zoom meeting link</a></Link>
            </div> : <div>
                <form onSubmit={HandleSubmitForm}>

                    <h2 className='h2'>
                        Fill this form to get introduce yourself to your own Responsibility
                    </h2>
                    {/* {
                error?<div className="error"><p>required</p></div>:null
                } */}
                    <div className="form-row">
                        <ul className="form-textfield">
                            <label>Name</label>
                            <li>
                                <input type="text"
                                    value={username}
                                    name="questionOne"
                                    disabled
                                    onChange={(event) => {
                                        setusername(event.target.value)
                                    }} />

                            </li>

                        </ul>
                    </div>

                    <div className="form-row">
                        <ul className="form-textfield">
                            <label>Phone Number</label>
                            <li>
                                <input type="text"
                                    value={phoneNum}
                                    name="questionOne"
                                    disabled
                                    onChange={(event) => {
                                        setphoneNum(event.target.value)
                                    }} />

                            </li>

                        </ul>
                    </div>

                         {/* 1st question */}
                        <div className="form-row radio-buttons">
                            <h2>1. Are you regular in attending Monthly Meeting?<sup>*</sup></h2>
                            <ul>

                                <li>

                                    <label htmlFor="1A">
                                        <input
                                            id="1A"
                                            value="Yes"
                                            name="questionOne"
                                            type="radio"
                                            onChange={questionOne}
                                            checked={onecheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes </label>
                                </li>
                                <li>
                                    <label htmlFor="1B">
                                        <input
                                            id="1B"
                                            value="No"
                                            name="questionOne"
                                            type="radio"
                                            onChange={questionOne}
                                            checked={onecheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No</label>
                                </li>

                                

                                {onecheck==="No" && (  <li>
                                        <input type="text"
                                             id="oneInput"
                                            value={oneQuestionInput}
                                            name="questionOne"
                                            placeholder='Share reason '
                                            required
                                            onChange={(event) => {
                                                setOneQuestionInput(event.target.value)
                                            }} />
                                </li> )}

                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>


                        {/* 2nd question */}
                        <div className="form-row radio-buttons">
                            <h2>2. Do you see a value in attending Monthly Meeting?<sup>*</sup></h2>

                            <ul>
                                <li>
                                    <label htmlFor="2A">
                                        <input
                                            id="2A"
                                            value="Yes"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes
                                    </label>

                                </li>

                                <li>
                                    <label htmlFor="2B">
                                        <input
                                            id="2B"
                                            value="No"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No</label>
                                </li>

                                {twocheck==="No" && (  <li>
                                    <input type="text"
                                            id="twoInput"
                                        value={twoQuestionInput}
                                        name="questionTwo"
                                        placeholder='Share your 2 reason'
                                        required
                                        onChange={(event) => {
                                            setTwoQuestionInput(event.target.value)
                                        }} />
                            </li> )}

                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                     

                        {/* 3nd question */}
                        <div className="form-row radio-buttons">
                            <h2>3. Which one of the following values is the core value of UJustBe Partner?  <sup>*</sup> </h2>
                            <ul>

                                <li >
                                    {threecheck && threecheck.map((threedata)=>(
                                    <>

                                    <div > 
 
                                                <input
                                                    id={threedata.name}
                                                    value={threedata}
                                                    name={threedata.name}
                                                    checked={threedata?.isChecked || false }
                                                    type="checkbox"
                                                    // required
                                                    onChange={questionThree} />
                                            
                                                <label  className='checkbox-label' htmlFor={threedata.name}> {threedata.name} </label>
                                    </div>
                                    </>
                                    ))}
                                </li>
                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                        {/* 4th question */}
                        <div className="form-row radio-buttons">
                                <h2>4. As a Partner, which one of the below two-values combinations you must have?<sup>*</sup></h2>
                                <ul>

                                    <li>
                                        <label htmlFor="4A">
                                            <input
                                                id="4A"
                                                value="Caring and Communication"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Caring and Communication'} />
                                            <div className='custom_radio'></div>
                                            Caring and Communication</label>
                                    </li>

                                    

                                    <li>
                                        <label htmlFor="4B">
                                            <input
                                                id="4B"
                                                value="Integrity and Fairness"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Integrity and Fairness'} />
                                            <div className='custom_radio'></div>
                                            Integrity and Fairness </label>
                                    </li>

                                    <li>
                                        <label htmlFor="4C">
                                            <input
                                                id="4C"
                                                value="Explore and Awareness"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Explore and Awareness'} />
                                            <div className='custom_radio'></div>
                                            Explore and Awareness</label>
                                    </li>

                                    <li>
                                        <label htmlFor="4D">
                                            <input
                                                id="4D"
                                                value="None of the Above"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'None of the Above'} />
                                            <div className='custom_radio'></div>
                                            None of the Above </label>
                                    </li>
                                </ul>
                                {
                                    error ? <div className="error"><p>this is required</p></div> : null
                                }
                            </div>

                        

                         {/* 5th question */}
                         <div className="form-row radio-buttons">
                            <h2>5. As a Mentor, which one of the below qualities that you must have?<sup>*</sup> </h2>
                            <ul>

                                    <li>
                                        <label htmlFor="5A">
                                            <input
                                                id="5A"
                                                value="Contributor"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'Contributor'} />
                                            <div className='custom_radio'></div>
                                            Contributor</label>
                                    </li>

                                    <li>
                                        <label htmlFor="5B">
                                            <input
                                                id="5B"
                                                value="Money-minded"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'Money-minded'} />
                                            <div className='custom_radio'></div>
                                            Money-minded </label>
                                    </li>

                                    <li>
                                        <label htmlFor="5C">
                                            <input
                                                id="5C"
                                                value="Complainer"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'Complainer'} />
                                            <div className='custom_radio'></div>
                                            Complainer</label>
                                    </li>

                                    <li>
                                        <label htmlFor="5D">
                                            <input
                                                id="5D"
                                                value="Self-centred"
                                                name="questionFive"
                                                type="radio"
                                                onChange={questionFive}
                                                checked={fivecheck == 'Self-centred'} />
                                            <div className='custom_radio'></div>
                                            Self-centred </label>
                                    </li>
                                </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                        {/* 6th question */}
                        <div className="form-row radio-buttons">
                            <h2>6. Which one of the below ways you use to pass referral to Listed Partners?  <sup>*</sup>  </h2>
                            <ul>

                                <li>

                                    <label htmlFor="6A">
                                        <input
                                            id="6A"
                                            value="Email to Core Team"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Email to Core Team'} />
                                        <div className='custom_radio'></div>
                                        Email to Core Team </label>
                                </li>
                                <li>
                                    <label htmlFor="6B">
                                        <input
                                            id="6B"
                                            value="Call to Core team member"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Call to Core team member'} />
                                        <div className='custom_radio'></div>
                                        Call to Core team member</label>
                                </li>

                                <li>
                                    <label htmlFor="6C">
                                        <input
                                            id="6C"
                                            value="UJustBe App"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'UJustBe App'} />
                                        <div className='custom_radio'></div>
                                        UJustBe App </label>
                                </li>
                                <li>
                                    <label htmlFor="6D">
                                        <input
                                            id="6D"
                                            value="Call to the respective Listed Partner"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Call to the respective Listed Partner'} />
                                        <div className='custom_radio'></div>
                                        Call to the respective Listed Partner </label>
                                </li>
                            </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>
                    {/* submit button */}
                    <div>
                        <button
                            type="submit"
                        >Submit
                        </button>
                    </div>

                </form>
            </div>
    }

    {/* form end here */}

        </section>
    </>
  )
}

export default RegistrationForm