const{expect} = require("chai");
const hre = require("hardhat");


describe("chai contract",function()
{
  this.timeout(60*60*1000); // Set timeout 10 mints(or adjust as needed)
  let Chai;
  let chai;
  let memos;
  let _allAddress;
  this.beforeEach(async function()
  {
    Chai = await ethers.getContractFactory("Chai");
    _allAddress= await ethers.getSigners();
    chai = await Chai.deploy();
  });



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
    [memos] = await chai.getMemo();
    //let _participantsBeforeBuy=memos.length;
    
    //lets buy lottery    
    let tx = await chai.connect(_allAddress[_user]).buyChai(_user.toString(),_allAddress[_user].address.toString(),{value:_numbOfEthersToTransfer});
    let receipt = await tx.wait();
    let gasCost = receipt.gasUsed.mul(tx.gasPrice);

    //After buy variables
    let _UBalanceAfter = await ethers.provider.getBalance(_allAddress[_user].address);
    let _UBalanceAfterBuySumGasAndLotteryAmount=_UBalanceAfter.add(_numbOfEthersToTransfer).add(gasCost);
    let _ownerBalanceAfter=await ethers.provider.getBalance(_allAddress[0].address);
    [memos] = await chai.getMemo();
    let _participantsAfterBuy=memos.length;

    //log
    _message=`User: ${_user} || address: ${_allAddress[_user].address} || buy chai & pay amount: ${ethers.utils.formatEther(_numbOfEthersToTransfer)}`;
    console.log(_message);

    //verify all 
    //using chai-bignumber library to handle extremly large numbers 
    expect(_UBalanceBefore.toString()).to.be.equal((_UBalanceAfterBuySumGasAndLotteryAmount.toString()).toString());
    expect(_ownerBalanceBefore.toString()).to.be.equal((_ownerBalanceAfter.sub(_numbOfEthersToTransfer)).toString());
    //expect(_participantsBeforeBuy).to.equal(_participantsAfterBuy-1);
  }

  describe("Deploy",function()
  {
    it("lets deploy it ", async function()
    {
      await buyChai();
    });
  });
});