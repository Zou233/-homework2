import {Button, Image} from 'antd';
import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from 'react';
import {studentDaoContract, myERC20Contract,myERC721Contract, web3} from "../../utils/contracts";
import './index.css';
import { isPropertyName } from 'typescript';
import Input from 'antd/lib/input/Input';
import { render } from '@testing-library/react';
import { ListItemLayout } from 'antd/lib/list';
import ListBody from 'antd/lib/transfer/ListBody';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:7545'

const LotteryPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState(0)
    const [playAmount, setPlayAmount] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [playerNumber, setPlayerNumber] = useState(0)
    const [managerAccount, setManagerAccount] = useState('')
    const [proName, setProName] = useState<string>('')
    const [proIndex1,setProIndex1] =useState<number>(0)
    const [proIndex2,setProIndex2] =useState<number>(0)
    const [proInfoIndex,setProInfoIndex] =useState<number>(0)
    const [balance,setBalance] =useState<number>(0)
    const [prosetLength,setProsetLength] =useState<number>(0)
    const [proInfo1,setProInfo1]=useState<string>('')
    const [proInfo2,setProInfo2]=useState<string>('')
    const [proInfo3,setProInfo3]=useState<string>('')
    const [proInfo4,setProInfo4]=useState<string>('')
    const [proInfo5,setProInfo5]=useState<string>('')
    const [proInfo6,setProInfo6]=useState<string>('')
    const [proInfo8,setProInfo8]=useState<string>('')
    const [proInfo9,setProInfo9]=useState<string>('')
    const [proInfo7,setProInfo7]=useState<string>('')
    const [proInfo10,setProInfo10]=useState<string>('')

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            //if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            //}
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getLotteryContractInfo = async () => {
            if (studentDaoContract) {
                const ma = await studentDaoContract.methods.manager().call()
                setManagerAccount(ma)
                const pn = await studentDaoContract.methods.getPlayerNumber().call()
                setPlayerNumber(pn)
                const pa = await studentDaoContract.methods.PLAY_AMOUNT().call()
                setPlayAmount(pa)
                const ta = await studentDaoContract.methods.totalAmount().call()
                setTotalAmount(ta)
            } else {
                alert('Contract not exists.')
            }
        }

        getLotteryContractInfo()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const show_proposal_num = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract&&myERC20Contract) {
            try {
                const pLenth=await studentDaoContract.methods.proposalIndex().call();
                setProsetLength(pLenth)
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const show_proposal = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract && myERC20Contract) {
            try {
                const pl= await studentDaoContract.methods.proposalIndex().call();
                if(proInfoIndex>=pl){
                    alert('index does not exist');
                }else{
                    await studentDaoContract.methods.show_pro(proInfoIndex).send({
                        from: account,
                        gas :1000000
                    })
                    const pi = await studentDaoContract.methods.proSet(proInfoIndex).call();
                    setProInfo1(pi.index);
                    setProInfo2(pi.proposer);
                    setProInfo3(pi.startTime);
                    setProInfo6(pi.name);
                    setProInfo7(pi.agreeNum);
                    setProInfo8(pi.disagreeNum);
                    if(pi.isChecked==true){
                        setProInfo9('是');
                    }else{
                        setProInfo9('否');
                    }
                    if(pi.isPassed==true){
                        setProInfo10('是');
                    }else{
                        setProInfo10('否');
                    }
                }
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const onClaimTokenAirdrop = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract&&myERC20Contract) {
            try {
                await studentDaoContract.methods.get_air_drop().send({
                    from: account,
                    gas :1000000
                })
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const get_balance = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract&&myERC20Contract) {
            try {
                const tmp=await studentDaoContract.methods.get_balance().call({
                    from: account,
                    gas :1000000
                })
                setBalance(tmp)
            } catch (error: any) {
                alert(error.message)
            }

        } else {
            alert('Contract not exists.')
        }
    }

    const on_arise_proposal = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract && myERC20Contract) {
            try {
                const pa = await studentDaoContract.methods.PLAY_AMOUNT().call()
                setPlayAmount(pa)
                await myERC20Contract.methods.approve(studentDaoContract.options.address, pa).send({
                    from: account,
                    gas:1000000
                })
                await studentDaoContract.methods.arise_proposal(proName).send({
                    from: account,
                    gas:1000000
                })

                alert('You have arised the proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const change_account = async () => {
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }
        
        const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
        
        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            //if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            //}

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }

    const on_agree_pro = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract && myERC20Contract) {
            try {
                const pa = await studentDaoContract.methods.PLAY_AMOUNT().call()
                //setPlayAmount(pa)
                await myERC20Contract.methods.approve(studentDaoContract.options.address, pa).send({
                    from: account,
                    gas:100000
                })
                await studentDaoContract.methods.agree_pro(proIndex1).send({
                    from: account,
                    gas:100000
                })
                alert('You have agreed the proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const on_disagree_pro = async () => {
        if(account === '') {
            alert('You have not connected wallet yet.')
            return
        }

        if (studentDaoContract && myERC20Contract) {
            try {
                const pa = await studentDaoContract.methods.PLAY_AMOUNT().call()
                setPlayAmount(pa)
                await myERC20Contract.methods.approve(studentDaoContract.options.address, pa).send({
                    from: account,
                    gas:100000
                })

                await studentDaoContract.methods.disagree_pro(proIndex2).send({
                    from: account,
                    gas:100000
                })

                alert('You have disagreed the proposal.')
            } catch (error: any) {
                alert(error.message)
            }
        } else {
            alert('Contract not exists.')
        }
    }

    const handleProName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProName(event.target.value)
    }

    const handleProIndex1 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProIndex1(event.target.valueAsNumber)
    }

    const handleProIndex2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProIndex2(event.target.valueAsNumber)
    }
    
    const handleProInfoIndex = (event:React.ChangeEvent<HTMLInputElement>) =>{
        setProInfoIndex(event.target.valueAsNumber)
    }

    return (
        <div className='container'>
            <Image
                width='100%'
                height='150px'
                preview={false}
                src={Header}
            />
            <div className='main'>
                <h1>去中心化学生社团组织治理网站</h1>
                <Button onClick={onClaimTokenAirdrop}>领取通证积分</Button>
                {/* <div>管理员地址：{managerAccount}</div> */}
                <div className='account'>
                    {account === '' && <Button onClick={change_account}>连接钱包</Button>}
                    <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                </div>
                <div className='operation'>
                    <div style={{marginBottom: '20px'}}>操作栏</div>
                    <div className='buttons'>
                        <div style={{display:'inline-block'}}>
                        <Button style={{width: '200px'}} onClick={get_balance}>查看通证积分数量</Button>
                        通证积分:{balance}
                        </div>
                        <div style={{display:'inline-block'}}>
                        <Button style={{width: '200px'}} onClick={on_arise_proposal}>发起提案</Button>
                        提案名称:<input  type="text" value={proName} onChange={handleProName} />
                        </div>
                        <div style={{display:'inline-block'}}>
                        <Button style={{width: '200px'}} onClick={on_agree_pro}>同意提案</Button>
                        提案编号:<input  type="number" value={proIndex1} onChange={handleProIndex1} />
                        </div>
                        <div style={{display:'inline-block'}}>
                        <Button style={{width: '200px'}} onClick={on_disagree_pro}>反对提案</Button>
                        提案编号:<input  type="number" value={proIndex2} onChange={handleProIndex2} />
                        </div>
                        <div style={{display:'inline-block'}}>
                        <Button style={{width: '200px'}} onClick={show_proposal_num}>展示提案数量</Button>
                        提案数量：{prosetLength}
                        {/* 提案编号:<input  type="number" value={proIndex2} onChange={handleProIndex2} /> */}
                        </div>
                        <div style={{display:'inline-block'}}>
                        <Button style={{width: '200px'}} onClick={show_proposal}>查看提案信息</Button>
                        提案编号:<input  type="number" value={proInfoIndex} onChange={handleProInfoIndex} />
                        编号:{proInfo1} 名称:{proInfo6} 发起提案地址:{proInfo2} 发起时间:{proInfo3}
                        赞同票数:{proInfo7} 反对票数:{proInfo8} 是否过期:{proInfo9} 是否通过:{proInfo10}
                        </div>
                        <Button style={{width: '200px'}} onClick={change_account}>更改账户</Button>
                        {/* <Input style={{width: '200px'} } placeholder="请输入提案名称" onChange={(e) => payMoneyChange(e)}></Input> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LotteryPage

