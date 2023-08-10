import { ethers } from "ethers";

const Buy =({state})=>
{

    const buyChai=async (event)=>
    {
        event.preventDefault();
        const {contract}=state; 
        const name = document.querySelector("#name").value;
        const message = document.querySelector("#message").value;
        const value=ethers.utils.parseEther("0.001");
        //console.log(name,message,contract);
        const transaction=await contract.buyChai(name,message);
        await transaction.wait();
        console.log("Transaction is done");
    }
    return<>
    <form onSubmit={buyChai}>
        <label>Name</label>
        <input type="text" id="name" placeholder="Enter Your Name"></input>
        <label>Message</label>
        <input type="text" id="message" placeholder="Enter Your Message"></input>
        <button type="submit">Pay</button>
    </form>
    </>
}
export default Buy;
