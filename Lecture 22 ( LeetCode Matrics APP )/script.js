//Sab se pehle main ne in sab elements ko javascript main fetch kr liya, or in pr ek event listener laga diya ke jeese hi mera
//DOM ka content poora load hoo jaye tab hi ye function run hogaa....

document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search_btn");
    const usernameInput = document.getElementById("user_input");
    const statsContainer = document.querySelector(".stats_container");
    const easyProgressCircle = document.querySelector(".easy_progress");
    const mediumProgressCircle = document.querySelector(".medium_progress");
    const hardProgressCircle = document.querySelector(".hard_progress");
    const easyLabel = document.getElementById("easy_label");
    const mediumLabel = document.getElementById("medium_label");
    const hardLabel = document.getElementById("hard_label");
    const cardStatsContainer = document.querySelector(".stats_card");

  //yahan pr main ek function write down karun ga jo ye make sure kare ga ke ye jo main username insert kr raha hun woh valid hai
  //ya nahi

  function ValidateUsername(username) {
    if (username.trim() === "") {
      //is line ka matlab hai ke agar mera username empty insert kiya jaye to alert box show hoga...
      alert("Username Should Not Be Empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{1,15}$/; // ye regular expression hai jo ke ek pattern based hai....
    const isMatching = regex.test(username); // is se hamara username test hoga ke sahi work kr raha hai ye nahi....

    if (!isMatching) {
      // is condition se hoga kr agar mera username wrong hai to alert aajayae ga..
      alert("Invalid Username");
    }
    return isMatching; // or agar true hai to isMatching yani true return ho jaaye ga
  }

  //yahan pr main ek async code likh raha hun jis ke andar main woh url ko fetch karun ga jahan se mujhe data lana hai
  async function fetchUserDetails(username) {  
    try{
      //yahan pr main ne ek try block laga liya hai
      searchButton.textContent = "Searching..."; //ye line hamare text ko change kr de ga
      searchButton.disabled = true; // or ye line hamare button ko disabled kr de ga

      //   const response = await fetch(url); //yahan main ne url ko fetch kr diya
      //...............................................................................................................
      //yahan ham ne ek post request di hai 

      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';//yahan pr ham ne ek demo server ka url likha hai
      const targetUrl = 'https://leetcode.com/graphql/';//ye woh target url hai jahan ham data bhej rahe hain...

      const myHeaders = new Headers();//header ek esa object hai jo data ke sath extra information bhejne ke kaam aata hai...
      myHeaders.append("content-type", "application/json");//yahan ham specify karte hain ke ham Json data bhej rahe hain...

      const graphql = JSON.stringify({//Yeh LeetCode ke ek user ki progress ke data ko retrieve karega...
          query:"\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
          variables: {username}//is query main username variable hai jis ki value dynamically set karni hai...
      });

      const requestOptions = {
          method: "POST",//is ka matlab hai ke API request POST method se bhej rahe hain.
          headers: myHeaders,//yahan pr Pehle wale myHeaders object ko include kiya.
          body: graphql,// ye woh JSON data hai jo GraphQL query aur variables ko contain karta hai.
      };                                                                                                                        


      // Simple working OF This Code:
      //1. API endpoint define kiya (targetUrl). 
      //2. Headers specify kiye ki JSON format ka data bhejna hai.
      //3. GraphQL query aur variables prepare kiye.
      //4. Request ka method (POST), headers, aur body define ki.
      //5. fetch() ka use karke API se data retrieve kiya.
      //.......................................................................................................
    
    const response = await fetch( proxyUrl + targetUrl , requestOptions );//yahan pr ham ne apne url or options ko response main save kr liya...
    
    if(!response.ok) {
        //yahan pr main ne ek condition laga di response ke ok na hone ki
        throw new Error("Unabel To Fetch The User Details"); //jab response ok nahi hoga to ye error throw hoga
    }
    const parsedData = await response.json(); //yahan response ko data main save kr liya
    console.log("Logging Data: ", parsedData); //yahan pr main ne data ko print krwa liya 
    
    displayUserData(parsedData);//yahan pr ham ne data ko populate karne wale function ki call di hai...
    
    } 
    catch(error) {
      statsContainer.innerHTML = `<p>No Data Found</p>`;//yahan pr ham ne ek error throw kr diya hai jo data absense pr hai
    } 
    finally {
      searchButton.textContent = "Search";// ye line hamare button content ko phir se search kr de gi
      searchButton.disabled = false;//is se hamara disabled hua button phir se visible ho jaye ga
    }
  }

  //yahan pr main ek function create kr raha hun jis main main ne sab data ko percentage main convert kr diya hai or
  //usse UI ke sath populate bhi kr diya hai
  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved/total)*100; //yahan pr ham ne data ki percentage nikal li..
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);//yahan pr us percentage ko circle ke sath populate kiya..
    label.textContent = `${solved}/${total}`;//or yahan pr label de diya ( 50/1037 ) ke is tarhan se label aaye ..
  }
 
  //ab ha yahan pr data ko UI ke sath populate karain gai:
  function displayUserData(parsedData){
    //ye sab total questions hain...
    const totalQues = parsedData.data.allQuestionsCount[0].count;//yahan ham ne all questions fetch kr liye...
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;//yahan ham ne easy questions fetch kr liye...
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;//yahan ham ne medium questions fetch kr liye...
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;//yahan ham ne hard questions fetch kr liye...
  
    //yahan tak ham ne total questions ko fetch kiya tha...
    //or ye solve kiye hue questions hain...
    const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;//is se solved questions
    const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;//is se solved questions
    const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;//is se solved questions
    const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;//is se solved questions

    //yahan pr ham ne apne data ke liye call di hai ke main jis jis cheez ki changing karna chahta hun woh main ne yahan,
    //likh diye hain
    updateProgress(solvedTotalEasyQues , totalEasyQues , easyLabel , easyProgressCircle);//ye easy circle ke liye
    updateProgress(solvedTotalMediumQues , totalMediumQues , mediumLabel , mediumProgressCircle);//ye medium circle ke liye
    updateProgress(solvedTotalHardQues , totalHardQues , hardLabel , hardProgressCircle);//ye hard circle ke liye

    //yahan pr ab main card ka data write down karun ga..
    const cardsData = [
      {label: "OverAll Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions },
      {label: "OverAll Easy Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions },
      {label: "OverAll Medium Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions },
      {label: "OverAll Hard Submissions", value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions },
    ]
    console.log("Card Ka Data:" ,cardsData);

    // ab ham apne cards ko UI ke sath connect karain ge:
    cardStatsContainer.innerHTML = cardsData.map(
      data => {
        return` 
           <div class = "card">
              <h3>${data.label}</h3>
              <p>${data.value}</p>
           </div>
          `
      }
    )
  }


  //ab main yahan pr woh function create kr raha hun ke jab main username field main koi username insert karun to woh javascript
  //main fetch ho jayen ge
  searchButton.addEventListener("click", function () {
    //real main is line of code se jo bhi value isse mile gi oh value ye username variable main save kr le gi...
    const username = usernameInput.value; // is se username fetch ho ga..
    console.log("logging Username:", username); //is se username console window pr aajaye ga..
    if (ValidateUsername(username)) {
      //ye ham ne username ko validate karne ki condition lagai hai
      fetchUserDetails(username);//yahan pr ham ne user detals ko fetch kiya hai...
    }
  });
});
