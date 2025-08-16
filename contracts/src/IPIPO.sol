// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title IPIPO - Influence Pre-sale Platform
 * @dev ERC-1155 based service voucher system for X/Twitter influence pre-sales
 * @author IPIPO Team
 * 
 * Core concept: Individual Personal brands (IPs) can pre-sell their future influence
 * by creating campaigns that mint ERC-1155 vouchers representing X platform exposure services.
 */
contract IPIPO is ERC1155, Ownable, ReentrancyGuard, Pausable {
    
    // Campaign types matching frontend enum
    enum CampaignKind {
        Tweet,      // 0 - Regular tweet
        Quote,      // 1 - Quote tweet  
        Reply       // 2 - Reply to tweet
    }
    
    // Campaign status matching frontend enum
    enum CampaignStatus {
        Active,     // 0 - Currently selling
        Paused,     // 1 - Paused by creator
        SoldOut,    // 2 - All vouchers sold
        Ended       // 3 - Campaign ended
    }
    
    // Redemption status matching frontend enum  
    enum RedemptionStatus {
        Pending,    // 0 - Redemption requested
        Completed,  // 1 - Service delivered
        Disputed    // 2 - Under dispute (future feature)
    }
    
    // Campaign data structure
    struct Campaign {
        uint256 id;
        address creator;
        string creatorHandle;      // @username
        CampaignKind kind;
        string name;
        string description;
        uint256 basePrice;         // Price in wei
        uint256 priceStep;         // Future: linear price increase per sale
        uint256 supply;            // Total vouchers available
        uint256 sold;              // Vouchers sold so far
        bool paused;               // Paused by creator
        uint256 createdAt;         // Timestamp
        string metaURI;            // IPFS hash for metadata (name, description, image, attributes)
    }
    
    // Redemption request structure
    struct Redemption {
        uint256 id;
        uint256 campaignId;
        address redeemer;
        string proofURL;           // X.com link proving service delivery
        RedemptionStatus status;
        uint256 timestamp;
    }
    
    // State variables
    uint256 private _nextCampaignId;
    uint256 private _nextRedemptionId;
    
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Redemption) public redemptions;
    mapping(uint256 => uint256[]) public campaignRedemptions; // campaignId => redemptionIds[]
    mapping(address => uint256[]) public creatorCampaigns;    // creator => campaignIds[]
    
    // Platform fee (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFee = 250;
    address public feeRecipient;
    
    // Events matching frontend expectations
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        CampaignKind kind,
        string name,
        uint256 basePrice,
        uint256 supply
    );
    
    event VouchersPurchased(
        uint256 indexed campaignId,
        address indexed buyer,
        uint256 amount,
        uint256 totalPaid
    );
    
    event VoucherRedeemed(
        uint256 indexed campaignId,
        uint256 indexed redemptionId,
        address indexed redeemer,
        string proofURL
    );
    
    event CampaignPaused(uint256 indexed campaignId, bool paused);
    event ProceedsWithdrawn(uint256 indexed campaignId, address indexed creator, uint256 amount);
    
    constructor(
        string memory baseURI,
        address _feeRecipient
    ) ERC1155(baseURI) Ownable(msg.sender) {
        feeRecipient = _feeRecipient;
        _nextCampaignId = 1;
        _nextRedemptionId = 1;
    }
    
    /**
     * @dev Create a new campaign
     * @param kind Type of service (Tweet, Quote, Reply)
     * @param name Campaign name
     * @param description Campaign description  
     * @param creatorHandle Creator's X handle (e.g., "@alice")
     * @param basePrice Price per voucher in wei
     * @param supply Total number of vouchers to mint
     * @param metaURI IPFS hash containing metadata
     */
    function createCampaign(
        CampaignKind kind,
        string memory name,
        string memory description,
        string memory creatorHandle,
        uint256 basePrice,
        uint256 supply,
        string memory metaURI
    ) external whenNotPaused returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(creatorHandle).length > 0, "Creator handle required");
        require(basePrice > 0, "Price must be greater than 0");
        require(supply > 0, "Supply must be greater than 0");
        require(supply <= 10000, "Supply too large"); // Reasonable limit
        
        uint256 campaignId = _nextCampaignId++;
        
        campaigns[campaignId] = Campaign({
            id: campaignId,
            creator: msg.sender,
            creatorHandle: creatorHandle,
            kind: kind,
            name: name,
            description: description,
            basePrice: basePrice,
            priceStep: 0, // Future feature
            supply: supply,
            sold: 0,
            paused: false,
            createdAt: block.timestamp,
            metaURI: metaURI
        });
        
        creatorCampaigns[msg.sender].push(campaignId);
        
        emit CampaignCreated(campaignId, msg.sender, kind, name, basePrice, supply);
        
        return campaignId;
    }
    
    /**
     * @dev Purchase vouchers for a campaign
     * @param campaignId The campaign to purchase from
     * @param amount Number of vouchers to purchase
     */
    function purchaseVouchers(
        uint256 campaignId,
        uint256 amount
    ) external payable nonReentrant whenNotPaused {
        Campaign storage campaign = campaigns[campaignId];
        
        require(campaign.creator != address(0), "Campaign does not exist");
        require(!campaign.paused, "Campaign is paused");
        require(amount > 0, "Amount must be greater than 0");
        require(campaign.sold + amount <= campaign.supply, "Not enough vouchers available");
        
        uint256 totalPrice = campaign.basePrice * amount;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Update campaign state
        campaign.sold += amount;
        
        // Mint vouchers to buyer
        _mint(msg.sender, campaignId, amount, "");
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit VouchersPurchased(campaignId, msg.sender, amount, totalPrice);
    }
    
    /**
     * @dev Redeem a voucher for service delivery
     * @param campaignId The campaign to redeem from
     * @param proofURL X.com link proving service was delivered
     */
    function redeemVoucher(
        uint256 campaignId,
        string memory proofURL
    ) external nonReentrant {
        require(balanceOf(msg.sender, campaignId) > 0, "No vouchers to redeem");
        require(bytes(proofURL).length > 0, "Proof URL required");
        
        // Burn one voucher
        _burn(msg.sender, campaignId, 1);
        
        // Create redemption record
        uint256 redemptionId = _nextRedemptionId++;
        
        redemptions[redemptionId] = Redemption({
            id: redemptionId,
            campaignId: campaignId,
            redeemer: msg.sender,
            proofURL: proofURL,
            status: RedemptionStatus.Completed, // Auto-complete for MVP
            timestamp: block.timestamp
        });
        
        campaignRedemptions[campaignId].push(redemptionId);
        
        emit VoucherRedeemed(campaignId, redemptionId, msg.sender, proofURL);
    }
    
    /**
     * @dev Creator can pause/unpause their campaign
     * @param campaignId Campaign to pause/unpause
     * @param paused New pause state
     */
    function setCampaignPaused(uint256 campaignId, bool paused) external {
        Campaign storage campaign = campaigns[campaignId];
        
        require(campaign.creator == msg.sender, "Only creator can pause campaign");
        require(campaign.paused != paused, "Already in desired state");
        
        campaign.paused = paused;
        
        emit CampaignPaused(campaignId, paused);
    }
    
    /**
     * @dev Creator withdraws proceeds from their campaign
     * @param campaignId Campaign to withdraw from
     */
    function withdrawProceeds(uint256 campaignId) external nonReentrant {
        Campaign memory campaign = campaigns[campaignId];
        
        require(campaign.creator == msg.sender, "Only creator can withdraw");
        require(campaign.sold > 0, "No proceeds to withdraw");
        
        uint256 totalRevenue = campaign.sold * campaign.basePrice;
        uint256 platformFeeAmount = (totalRevenue * platformFee) / 10000;
        uint256 creatorAmount = totalRevenue - platformFeeAmount;
        
        // Reset sold amount to prevent double withdrawal
        campaigns[campaignId].sold = 0;
        
        // Transfer platform fee
        if (platformFeeAmount > 0) {
            payable(feeRecipient).transfer(platformFeeAmount);
        }
        
        // Transfer creator proceeds
        payable(msg.sender).transfer(creatorAmount);
        
        emit ProceedsWithdrawn(campaignId, msg.sender, creatorAmount);
    }
    
    /**
     * @dev Get campaigns created by an address
     * @param creator Creator address
     * @return Array of campaign IDs
     */
    function getCampaignsByCreator(address creator) external view returns (uint256[] memory) {
        return creatorCampaigns[creator];
    }
    
    /**
     * @dev Get redemptions for a campaign
     * @param campaignId Campaign ID
     * @return Array of redemption IDs
     */
    function getRedemptionsByCampaign(uint256 campaignId) external view returns (uint256[] memory) {
        return campaignRedemptions[campaignId];
    }
    
    /**
     * @dev Get current campaign status
     * @param campaignId Campaign ID
     * @return Current status enum
     */
    function getCampaignStatus(uint256 campaignId) external view returns (CampaignStatus) {
        Campaign memory campaign = campaigns[campaignId];
        
        if (campaign.paused) {
            return CampaignStatus.Paused;
        } else if (campaign.sold >= campaign.supply) {
            return CampaignStatus.SoldOut;
        } else {
            return CampaignStatus.Active;
        }
    }
    
    /**
     * @dev Get next campaign ID (for frontend)
     */
    function getNextCampaignId() external view returns (uint256) {
        return _nextCampaignId;
    }
    
    /**
     * @dev Admin function to set platform fee
     * @param newFee New fee in basis points (max 1000 = 10%)
     */
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = newFee;
    }
    
    /**
     * @dev Admin function to set fee recipient
     * @param newRecipient New fee recipient address
     */
    function setFeeRecipient(address newRecipient) external onlyOwner {
        require(newRecipient != address(0), "Invalid recipient");
        feeRecipient = newRecipient;
    }
    
    /**
     * @dev Emergency pause function
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Emergency unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override URI function to support dynamic metadata
     * @param tokenId Token ID (campaign ID)
     */
    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        Campaign memory campaign = campaigns[tokenId];
        if (bytes(campaign.metaURI).length > 0) {
            return campaign.metaURI;
        }
        return super.uri(tokenId);
    }
}
