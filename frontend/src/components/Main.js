import React from 'react'
import { useState, useEffect } from "react";
import "./Styles.css"
import Web3 from "web3"
import vendingMachineContract from "../vending"

function Main() {

    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [inventory, setInventory] = useState('')
    const [myDonutCount, setmyDonatCount] = useState('')
    const [buyCount, setbuyCount] = useState('')
    const [web, setweb] = useState(null)
    const [address, setaddress] = useState("")
    const [vmContract, setvmContract] = useState(null)
    const [purchases, setPurchases] = useState(0)

    useEffect(() => {
        if (vmContract) getInventoryHandler()
        if (vmContract && address) getMyDonutCountHandler()
    }, [vmContract, address, purchases])


const getInventoryHandler = async () => {
    const inventory = await vmContract.methods.getVendingMachineBalance().call()
    setInventory(inventory)
}

const getMyDonutCountHandler = async () => {
    const count = await vmContract.methods.donutBalances(address).call()
    setmyDonatCount(count)
}

const updateDonutQty = event => {
    setbuyCount(event.target.value)
}

const buyDonutHandler = async (event) => {
    event.preventDefault();
    try {
        {console.log({address})}
        await vmContract.methods.purchase(buyCount).send({
            from: address,
            value: web.utils.toWei('0.1', 'ether') * buyCount,
        })
        setSuccessMsg(`${buyCount} donuts purchased!`)
        {console.log("successMsg")}

        if (vmContract) getInventoryHandler()
        if (vmContract && address) getMyDonutCountHandler()
    } catch(err) {
        setError(err.message)
    }
}
 
const connectWalletHandler = async () => {
    // if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            const web3 = new Web3(window.ethereum)
            setweb(web3)

            const account = await web3.eth.getAccounts()
            setaddress(account[0])
            {console.log(address)}
            const vm = vendingMachineContract(web)
            
            setvmContract(vm)
        } catch (err) {
            setError(err.messsage)
        }
    // } else {
    //     console.log("Please install MetaMask")
    // }
}

    
// 
    return (
    <div>
        <div>
        <nav className='navbar' >
            <p className='navbar_logo' >Rypto-Donuts</p>
            <button className='navbar_btn' onClick={connectWalletHandler}>
                            Connect Wallet
                        </button>
        </nav>
    </div>
        <div className='main'>
            <div className='main_inventory'>Donuts Left = {inventory}</div>
            <div className='main_owninvent'>Donuts in own account = {myDonutCount}</div>
            <form className='purchase'>
                <input className='purchase_input' onChange={updateDonutQty} type="text" placeholder="Enter your quantity" />
                <button className='purchase_btn' onClick={buyDonutHandler} type="submit">Buy</button>
            </form>
        </div>
        </div>
    )
}

export default Main
