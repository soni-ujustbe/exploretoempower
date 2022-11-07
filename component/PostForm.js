import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import firebaseApp from '../firebaseConfig';
import { collection, ref, push, addDoc, setDoc, doc, docs, getDocs, deleteDoc, arrayUnion, getDoc,Timestamp, updateDoc, query } from "firebase/firestore";
import { getFirestore, onSnapshot } from "firebase/firestore";
import Router from 'next/router';
import Link from 'next/link'
import zoomlogo from '../public/images/zoom.png'
import Header from "../component/module/Header"
const db = getFirestore();

//Image import
import topbannerimg from '../public/images/topbanner.png';

const threecheckdata = [
    { name: "Identify ‘Racket situations’ in Personal Relationships" },
    { name: "Identify ‘Racket’ situations in Professional/Business Relationships" },
    { name: "Identify impacts related to Personal Health due to Life Sentences" },
    { name: "Identify areas in Professional/Business Health which are impacted due to Life Sentences" },   
    { name: "Identify how Life Sentences are impacting ability to create Personal Wealth" },   
    { name: "Identify ‘Rackets’ impacting to Professional/Business Wealth" },   
      
];

const fivecheckdata = [
    { name: "You are fixed" },
    { name: "You are fearful of losing" },
    { name: "You keep running away" },
    { name: "You are happy" },
];


const PostForm = () => {

    //state used for form
    const [phoneNum, setphoneNum] = useState('')
    const [username, setusername] = useState('')
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [singleUsers, setsingleUsers] = useState('');


    const [onecheck, setoneCheck] = useState('');
    const [twocheck, setTwoCheck] = useState('');
    const [threecheck, setThreeCheck] = useState(threecheckdata);
    const [fourcheck, setFourCheck] = useState([]);
    const [fivecheck, setFiveCheck] = useState(fivecheckdata);

    const [sixcheck, setSixCheck] = useState('');
    const [sevencheck, setSevenCheck] = useState('');

    const [oneQuestionInput, setOneQuestionInput] = useState("");
    const [twoQuestionInput, setTwoQuestionInput] = useState("");

   
    const [UserData, setUserData] = useState([]);
    const [userId, setuserId] = useState('');
    const [error, seterror] = useState(false);
    const [formsubmit, setformsubmit] = useState(false)

    const [postfeedbackImg, setpostfeedbackImg] = useState('')
    const [mobileFormbg, setmobileFormbg] = useState('')
    const [eventName, seteventName] = useState('')
    const [secondInput, setsecondInput] = useState("");
    const [second, setsecond] = useState(false);
    const [whatsappgroup, setwhatsappgroup] = useState("");




    //function for add data in firebase
    const CreatForm = async (event) => {
        event.preventDefault();

        const isLogin = localStorage.getItem("ucore");
        const usersDetails = JSON.parse(isLogin);
        console.log(usersDetails);

        const data = {

            username: username,
            phoneNum: phoneNum,
            PostOneAns: onecheck,
            PostOneInput:oneQuestionInput,
            PostTwoAns: twocheck,
            PostTwoInput:twoQuestionInput,
            PostThreeAns: threecheck,
            PostFourAns: fourcheck,
            PostFiveAns: fivecheck,
            PostSixAns:sixcheck,
            PostSevenAns:sevencheck,
            postfeedbackImg: postfeedbackImg,
            createdBy:Timestamp.now(),


        };

        //if user empty throw error else merge the form data in firebase
          //if user empty throw error else merge the form data in firebase
        if (onecheck==="" || twocheck==="" || threecheck==="" || fourcheck==="" || fivecheck==="" || sixcheck==="")
        {
            seterror(true);
            setThreeCheck(threecheckdata);
            setFiveCheck(fivecheckdata);
        }
        else {
            const isLogin = localStorage.getItem("ucore");
            const usersDetails = JSON.parse(isLogin);

            setpostfeedbackImg();
            const docRef = doc(db, usersDetails.eventName, phoneNum);

            await setDoc(docRef, data, { merge: true });
           
            console.log("Feedback data", data);

            setformsubmit(true);

        }

        //clear all field after submit the data
        setoneCheck("");
        setOneQuestionInput("");
        setTwoCheck("");
        setTwoQuestionInput("");
        setThreeCheck(threecheck)
        setFourCheck("");
        setFiveCheck(fivecheck);
        setSixCheck("");
        setSevenCheck("");
        // setformbgImage("");
        // setwhatsappLink("");
        //   Router.push('/dashboard');
    }

    //target checked data for store in firestore

    const questionOne = (event) => {
        const target = event.target;
        if (target.checked) {
            setoneCheck(target.value);
            console.log(event.target.value);
        }

    };

    const questionTwo = (event) => {
        const target = event.target;
        if (target.checked) {
            setTwoCheck(target.value);
            console.log(event.target.value);
        }

    };
    const questionThree = (e) => {
        const {name,checked}= e.target;
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

    const questionFive = (e) => {
        const {name,checked}= e.target;
        let tempFiveData=fivecheck.map((fivedetails)=>
        fivedetails.name === name ? { ...fivedetails, isChecked:checked } : fivedetails);
        setFiveCheck(tempFiveData);

        console.log("fivequestion",fivecheck);
    };

    const questionSix = (event) => {
        const target = event.target;
        if (target.checked) {
            setSixCheck(target.value);
            console.log(event.target.value);
        }
    };

    const questionSeven = (event) => {
        const target = event.target;
        if (target.checked) {
            setSevenCheck(target.value);
            console.log(event.target.value);
        }
    };

    useEffect(() =>{
       
        setThreeCheck(threecheckdata);
        setFiveCheck(fivecheckdata);

    },[]);

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
        // console.log(eventName);

        setLoading(true);

        const getContent = async () => {

            onSnapshot(collection(db, eventName), (snapshot) => {
                console.log("MMform", snapshot);

            });
        }
        const getsingleDoc = async () => {

            const isLogin = localStorage.getItem("ucore");
            const usersDetails = JSON.parse(isLogin);
            console.log(usersDetails);

            const docRef = doc(db, "AdminMonthlyMeet", eventName);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setsingleUsers(docSnap.data());
                console.log(singleUsers);
                console.log("Document data:", docSnap.data());
                setpostfeedbackImg(docSnap.data().formImgUrls);
                setmobileFormbg(docSnap.data().mobileUrls);
                seteventName(docSnap.data().eventName);
                // setwhatsappgroup(docSnap.data().whatsappLink);
                console.log(docSnap.data().whatsappLink);


            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

        }
        // getContent();
        getsingleDoc();
    }, []);


    return (
      <>

            <Header/>
            <section className="c-containerForm">

                <div className='topbanner'>
                    <img className='desktopFormbg' src={postfeedbackImg} />
                    <img className='mobileFormbg' src={mobileFormbg} />
                    {/* <Image src={topbannerimg} placeholder="blur" alt='logo' /> */}

                    

                    {/* <div class="topbanner-navbar ">
                        <div class="topnav">
                            <a href="#home">Home</a>
                            <a href="#news">Feedback</a>
                            <a href={"userprofile/[upid]"} as={"userprofile/" + phoneNum}>Profile</a>
                            <a href="#about">Logout</a>
                        </div>
                    </div> */}
                    <div className="bannertext">
                        <h1>{eventName}</h1>
                    </div>
                </div>

                {/* form start  */}

                {
                    formsubmit ? <div className="sucess">
                        <h2>  Thank you for sharing your responses. </h2>

                        <Link href="/dashboard" ><a className="homelink">Go back to home</a></Link>

                    </div> : <div>
                        <form>
                            {/* {
                        error?<div className="error"><p>required</p></div>:null
                        } */}
                            <div className="form-row">
                                <ul className="form-textfield">
                                <label>Name</label>
                                    <li>
                                        <input type="text"
                                            value={username}
                                            name="username"
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
                                            name="phonenumber"
                                            disabled
                                            onChange={(event) => {
                                                setphoneNum(event.target.value)
                                            }} />

                                    </li>

                                </ul>
                            </div>

                                {/* 1st question */}
                        <div className="form-row radio-buttons">
                            <h2>1. Do you see yourself more ‘Aware’ now?<sup>*</sup></h2>
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
                            <h2>2. Are you now aware of your own rackets?<sup>*</sup></h2>

                            <ul>
                                <li>
                                    <label htmlFor="2A">
                                        <input
                                            id="2A"
                                            value="No"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'No'} />
                                        <div className='custom_radio'></div>
                                        No
                                    </label>

                                </li>

                                <li>
                                    <label htmlFor="2B">
                                        <input
                                            id="2B"
                                            value="Yes"
                                            name="questionTwo"
                                            type="radio"
                                            onChange={questionTwo}
                                            checked={twocheck == 'Yes'} />
                                        <div className='custom_radio'></div>
                                        Yes</label>
                                </li>

                                {twocheck==="Yes" && (  <li>
                                        <input type="text"
                                             id="twoInput"
                                            value={twoQuestionInput}
                                            name="questionTwo"
                                            placeholder='Share your 1 racket that you could distinguish'
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
                            <h2>3. In which of the below mentioned areas you need immediate help/support from the Nucleus Team?<sup>*</sup> </h2>
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
                                <h2>4. Which is/are of the below things which you think is impacting your authenticity the most? <sup>*</sup></h2>
                                <ul>

                                    <li>
                                        <label htmlFor="4A">
                                            <input
                                                id="4A"
                                                value="Unawareness of rackets"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Unawareness of rackets'} />
                                            <div className='custom_radio'></div>
                                            Unawareness of rackets</label>
                                    </li>

                                    

                                    <li>
                                        <label htmlFor="4B">
                                            <input
                                                id="4B"
                                                value="Life Sentence: I am on my Own"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Life Sentence: I am on my Own'} />
                                            <div className='custom_radio'></div>
                                            Life Sentence: I am on my Own </label>
                                    </li>

                                    <li>
                                        <label htmlFor="4C">
                                            <input
                                                id="4C"
                                                value="Life Sentence: I don’t belong"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'Life Sentence: I don’t belong'} />
                                            <div className='custom_radio'></div>
                                            Life Sentence: I don’t belong </label>
                                    </li>

                                    <li>
                                        <label htmlFor="4D">
                                            <input
                                                id="4D"
                                                value="All of the Above"
                                                name="questionFour"
                                                type="radio"
                                                onChange={questionFour}
                                                checked={fourcheck == 'All of the Above'} />
                                            <div className='custom_radio'></div>
                                            All of the Above </label>
                                    </li>

                                    <li>
                                        <label htmlFor="4E">
                                            <input
                                                id="4E"
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
                            <h2>5. Which one of the below things that happens due to Life Sentence called ‘Winning Formula’? <sup>*</sup> </h2>
                            <ul>
                            <li >
                                    {fivecheck && fivecheck.map((fivedata)=>(
                                    <>

                                    <div > 
 
                                                <input
                                                    id={fivedata.name}
                                                    value={fivedata}
                                                    name={fivedata.name}
                                                    checked={fivedata?.isChecked || false }
                                                    type="checkbox"
                                                    // required
                                                    onChange={questionFive} />
                                            
                                                <label  className='checkbox-label' htmlFor={fivedata.name}> {fivedata.name} </label>
                                    </div>
                                    </>
                                    ))}
                                </li>

                                </ul>
                            {
                                error ? <div className="error"><p>this is required</p></div> : null
                            }

                        </div>

                        {/* 6th question */}
                        <div className="form-row radio-buttons">
                            <h2>6. Which of the below outcomes of being aware that you think you can achieve after this session? <sup>*</sup>  </h2>
                            <ul>

                                <li>

                                    <label htmlFor="6A">
                                        <input
                                            id="6A"
                                            value="Living with Fearless nature"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Living with Fearless nature'} />
                                        <div className='custom_radio'></div>
                                        Living with Fearless nature </label>
                                </li>
                                <li>
                                    <label htmlFor="6B">
                                        <input
                                            id="6B"
                                            value="Being Courageous"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Being Courageous'} />
                                        <div className='custom_radio'></div>
                                        Being Courageous</label>
                                </li>
                                <li>
                                    <label htmlFor="6C">
                                        <input
                                            id="6C"
                                            value="Always looking for new possibilities"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Always looking for new possibilities'} />
                                        <div className='custom_radio'></div>
                                        Always looking for new possibilities</label>
                                </li>
                                <li>
                                    <label htmlFor="6D">
                                        <input
                                            id="6D"
                                            value="Cannot be fooled by self"
                                            name="questionSix"
                                            type="radio"
                                            onChange={questionSix}
                                            checked={sixcheck == 'Cannot be fooled by self'} />
                                        <div className='custom_radio'></div>
                                        Cannot be fooled by self</label>
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
                                    onClick={CreatForm}
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

export default PostForm


