let contractAddress="ct_8zmH3erNcM7CWM3Usft33L5doEjaLzXmZEMvLsUY6aXeKoX8K ";
let contractSource=`contract MemeVote=
record meme={
  name:string,
  url:string,
  creatorAddress:address,
  voteCount:int
  }
entrypoint init()={memes={},totalVoteCount=0}

record state={
  totalVoteCount:int,
  memes:map(int,meme)
  }

stateful entrypoint registerMeme(name':string, url':string)=
  let newMeme={name=name',url=url',creatorAddress=Call.caller,voteCount=0}
  let index=getTotalVoteCount()+1
  put(state{memes[index]=newMeme,totalVoteCount=index})
      
entrypoint getTotalVoteCount()=
  state.totalVoteCount
  
entrypoint getMeme(index)=
  state.memes[index]
  
entrypoint getAllMemes()=
  state.memes
  
payable stateful entrypoint voteMeme(index:int)=
  let selectedMeme=getMeme(index)
  Chain.spend(selectedMeme.creatorAddress,Call.value)
  let selectedMemeVoteCount=selectedMeme.voteCount+Call.value
  let votedMeme=selectedMeme{voteCount=selectedMemeVoteCount}
  put(state{memes[index]=votedMeme})

`
let client=null

async function windowsLoaded(){
client=await Ae.Aepp();
let myArr= await callStatic('getAllMemes',[]);
}
window.addEventListener('load',windowsLoaded);

async function contractCall(functionName,argsArray,value){
    let contract =client.getContractInstance(contractSource,{contractAddress});
   let response=await contract.call(functionName,argsArray,{amount:value}).catch(e=>console.error(e));
   console.log("response",response);
    return response;
}

// async function callStatic(functionName,argsArray){
//     let contract=client.getContractInstance(constractSource,{contractAddress});
//     let response=await contract.call(functionName,argsArray,{callStatic:true}).catch(e=>console.error(e));
//     let decodedResponse=response.decode().catch(e=>console.error(e));
//     console.log(decodedResponse);
// }

async function callStatic(func, args) {
    //Create a new contract instance that we can interact with
    const contract = await client.getContractInstance(contractSource, {contractAddress});
    //Make a call to get data of smart contract func, with specefied arguments
    const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
    //Make another call to decode the data received in first call
    const decodedGet = await calledGet.decode().catch(e => console.error(e));
  
    return decodedGet;
  }

function createNewMeme(){
    let allMemes=document.getElementById("all-memes");

    let individualMeme=document.createElement("div");
    individualMeme.classList.add("individual-meme");

    let voteCountParagraph=document.createElement('p');
    voteCountParagraph.innerText='Votecount : 3';

    let memeImage=document.createElement('img');
    memeImage.src=""

    let aeInput=document.createElement('input');
    aeInput.placeholder="Enter Meme url" 

    let voteButton=document.createElement('button');
    voteButton.classList.add('vote');

   
    individualMeme.appendChild(voteCountParagraph);
    individualMeme.appendChild(memeImage);
    individualMeme.appendChild(aeInput);
    individualMeme.appendChild(voteButton);

    allMemes.appendChild(individualMeme);
}
let myArr=[[1,{"creatorAddress":"ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG","name":"jesulonimiTwo","url":"myUrlOne","voteCount":0}],
[2,{"creatorAddress":"ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG","name":"jesulonimione","url":"myUrlOne","voteCount":0}],
[3,{"creatorAddress":"ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG","name":"jesulonimione","url":"myUrlOne","voteCount":0}],
[4,{"creatorAddress":"ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG","name":"jesulonimione","url":"myUrlOne","voteCount":0}],[5,{"creatorAddress":"ak_2bKhoFWgQ9os4x8CaeDTHZRGzUcSwcXYUrM12gZHKTdyreGRgG","name":"jesulonimione","url":"myUrlthree","voteCount":0}]] 
for(let i in myArr){
    console.log(myArr[i]);
    let allMemes=document.getElementById("all-memes");

    let individualMeme=document.createElement("div");
    individualMeme.classList.add("individual-meme");

    let voteCountParagraph=document.createElement('p');
    voteCountParagraph.innerText='Votecount :'+ myArr[i][1]['voteCount'];

    let memeImage=document.createElement('img');
    memeImage.src=myArr[i][1].url;

    let aeInput=document.createElement('input');
    aeInput.placeholder="Enter Meme url" 

    let voteButton=document.createElement('button');
    voteButton.innerText="Vote"
    voteButton.addEventListener('click',function(){
        aeInput.value=myArr[i][1].url;
        console.log(myArr[i][0])
    });
    voteButton.classList.add('vote');

   
    individualMeme.appendChild(voteCountParagraph);
    individualMeme.appendChild(memeImage);
    individualMeme.appendChild(aeInput);
    individualMeme.appendChild(voteButton);

    allMemes.appendChild(individualMeme);
}
