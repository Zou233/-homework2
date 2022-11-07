// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment the line to use openzeppelin/ERC20
// You can use this dependency directly because it has been installed already
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./MyERC20.sol";
import "./MyERC721.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract StudentSocietyDAO {

    // use a event if you want
    event ProposalInitiated(uint32 proposalIndex);

    struct Proposal {
        uint32 index;      // index of this proposal
        address proposer;  // who make this proposal
        uint256 startTime; // proposal start time
        uint256 duration;  // proposal duration
        uint256 endTime;
        string name;       // proposal name

        uint32 agreeNum;
        uint32 disagreeNum;
        bool isChecked;
        bool isPassed;
        // ...
        // TODO add any member if you want
    }

    Proposal[] public proSet; 
    uint32 public proposalIndex;
    MyERC20 public studentERC20;
    MyERC721 public studentERC721;
    mapping(uint32 => Proposal) public proposals; // A map from proposal index to proposal
    mapping(address => uint32) public proNum;
    mapping(address=>uint256) public newItemID;
    // ...
    // TODO add any variables if you want

    mapping(address => bool) public hasAirdrop;

    uint256 public constant PLAY_AMOUNT = 1000;

    constructor() {
        // maybe you need a constructor
        studentERC20 = new MyERC20("ZJUToken", "ZJUToken");
        studentERC721=new MyERC721();
        proposalIndex=0;
    }

    //get ZJUTokens

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    function get_air_drop() external{
        studentERC20.airdrop(msg.sender);
    }

    function get_balance() public view returns(uint256){
        return studentERC20.balanceOf(msg.sender);
    }

    function get_balance(address addr) public view returns(uint256){
        return studentERC20.balanceOf(addr);
    }

    // function show_proposal(uint32 proIndex) public returns(string){
    //     require(proIndex<prosetIndex,"index does not exists");
    //     string ans="";
    //     if(proSet[proIndex].isChecked){
    //         ans+="This proposal is out to date\n";
    //     }
    //     ans+="Proposal Index:"+string(proIndex)+"\n";
    //     ans+="Proposal name:"+proSet[proIndex].name+"\n";
    //     ans+="Proposer Address:"+string(proSet[proIndex].proposer)+"\n";
    //     ans+="Start time:"+string(proSet[proIndex].startTime)+"\n";
    //     ans+=string(proSet[proIndex].agreeNum)+" people have agreed this proposal\n";
    //     ans+=string(proSet[proIndex].disagreeNum)+" people have disagreed this proposal\n";
    //     return ans;
    // }

    function arise_proposal(string memory proName) public returns(Proposal memory){
        require(get_balance(msg.sender)>=100,"No enough token to arise proposal!\n");
        Proposal memory pro;
        pro.index=proposalIndex;
        proposalIndex++;
        pro.duration=30;
        pro.name=proName;
        pro.startTime=block.timestamp;
        pro.endTime=pro.startTime+pro.duration;
        pro.proposer=msg.sender;
        pro.agreeNum=0;
        pro.isChecked=false;
        pro.disagreeNum=0;
        pro.isPassed=false;
        proSet.push(pro);
        studentERC20.transferFrom(msg.sender,address(this),100);
        //studentERC20.transfer(address(this),1);
        return pro;
    }

    function agree_pro(uint32 proIndex) public{
        require(proIndex<proposalIndex,"index does not exists");
        require(get_balance(msg.sender)>=100,"No enough token to agree proposal!\n");
        require(proSet[proIndex].isChecked==false,"proposal is out date\n");
        if(block.timestamp<=proSet[proIndex].endTime){
            proSet[proIndex].agreeNum++;
            studentERC20.transferFrom(msg.sender,address(this),100);
        }else{
            deal_pro(proIndex);
            studentERC20.transferFrom(msg.sender,address(this),100);
            require(false,"proposal is out date");
        }
    }

    function disagree_pro(uint32 proIndex) public{
        require(proIndex<proposalIndex,"index does not exists");
        require(get_balance(msg.sender)>=100,"No enough token to agree proposal!\n");
        require(proSet[proIndex].isChecked==false,"proposal is out date");
        if(block.timestamp<=proSet[proIndex].endTime){
            proSet[proIndex].disagreeNum++;
            studentERC20.transferFrom(msg.sender,address(this),100);
        }else{
            deal_pro(proIndex);
            studentERC20.transferFrom(msg.sender,address(this),100);
            require(false,"proposal is out date");
        }
    }

    function deal_pro(uint32 proIndex) public{
        require(proIndex<proposalIndex,"index does not exists");
        if(proSet[proIndex].agreeNum>proSet[proIndex].disagreeNum){
            proSet[proIndex].isPassed=true;
            studentERC20.get_prize(proSet[proIndex].proposer);
            proNum[proSet[proIndex].proposer]++;
            if(proNum[proSet[proIndex].proposer]==3){
                studentERC721.awardItem(proSet[proIndex].proposer,"MyERC721");
            }
        }
        proSet[proIndex].isChecked=true;
    }

    function show_pro(uint32 proIndex) public{
        require(proIndex<proposalIndex,"index does not exists");
        if(block.timestamp>proSet[proIndex].endTime){
            deal_pro(proIndex);
        }
    }
    // ...
    // TODO add any logic if you want

}
