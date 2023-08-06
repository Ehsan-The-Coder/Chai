const{expect} = require("chai");
const hre = require("hardhat");


describe("chai contract",function()
{
  this.timeout(60*60*1000); // Set timeout 10 mints(or adjust as needed)
  let Chai;
  let chai;
  let _allAddress;
  this.beforeEach(async function()
  {
    Chai = await ethers.getContractFactory("Chai");
    _allAddress= await ethers.getSigners();
    chai = await Chai.deploy();
  });


  async function lengthOfMemos()
  {
    const memos=await chai.getMemo();
    return memos.length;
  }
  async function listOfMemos()
  {
    const memos=await chai.getMemo();
    for (let i = 0; i < memos.length; i++) 
    {
      const memo = memos[i];
      console.log(`name:${memo.name} message:${memo.message} timestamp:${formatDate(memo.timestamp.toNumber())} from:${memo.from}`);
    }
  }
  function formatDate(timestamp) 
  {
    const date = new Date(timestamp * 1000); // Multiply by 1000 to convert to milliseconds
    return date.toUTCString(); // Convert the date to a human-readable string
  }  
  async function buyChai()
  {
    //randomly generating user 
    let min = 1;//minimum user
    let max = 19;//maximum user
    let _user = Math.floor(Math.random()*(max - min + 1)) + min;
    max = 100;
    let _numbOfEthersToTransfer = Math.floor(Math.random() * (max - min + 1)) + min;
    _numbOfEthersToTransfer=hre.ethers.utils.parseEther(_numbOfEthersToTransfer.toString());

    //before buying variables 
    let _UBalanceBefore = await ethers.provider.getBalance(_allAddress[_user].address);
    let _ownerBalanceBefore=await ethers.provider.getBalance(_allAddress[0].address);
    let _participantsBeforeBuy=await lengthOfMemos();
    
    //lets buy lottery    
    let tx = await chai.connect(_allAddress[_user]).buyChai(_user.toString(),"Ehsan",{value:_numbOfEthersToTransfer});
    let receipt = await tx.wait();
    let gasCost = receipt.gasUsed.mul(tx.gasPrice);

    //After buy variables
    let _UBalanceAfter = await ethers.provider.getBalance(_allAddress[_user].address);
    let _UBalanceAfterBuySumGasAndLotteryAmount=_UBalanceAfter.add(_numbOfEthersToTransfer).add(gasCost);
    let _ownerBalanceAfter=await ethers.provider.getBalance(_allAddress[0].address);
    let _participantsAfterBuy=await lengthOfMemos();
    //log
    _message=`user: ${_user} || address: ${_allAddress[_user].address} || buy chai & pay amount: ${ethers.utils.formatEther(_numbOfEthersToTransfer)}`;
    console.log(_message);
    _message=`owner balance before:${hre.ethers.utils.formatEther(_ownerBalanceBefore)} || owner balance after:${ ethers.utils.formatEther(_ownerBalanceAfter)}`;
    console.log(_message);
    console.log("<----------------------------------------------------------------------------->");

    //verify all 
    //using chai-bignumber library to handle extremly large numbers 
    expect(_UBalanceBefore.toString()).to.be.equal((_UBalanceAfterBuySumGasAndLotteryAmount.toString()).toString());
    expect(_ownerBalanceBefore.toString()).to.be.equal((_ownerBalanceAfter.sub(_numbOfEthersToTransfer)).toString());
    expect(_participantsBeforeBuy).to.equal(_participantsAfterBuy-1);
  }

  describe("Deploy",function()
  {
    it("check if the user able to buy single chai ", async function()
    {
      await buyChai();
    });
    it("check if the multiple user able to buy chai ", async function()
    {
      for(let i=0; i<10;i++)
      {
        await buyChai();
      }
    });
    it("check if we can see the list of buyer", async function()
    {
      for(let i=0; i<10;i++)
      {
        await buyChai();
      }
      await listOfMemos();
    });
  });
});