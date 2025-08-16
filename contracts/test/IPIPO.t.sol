// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {IPIPO} from "../src/IPIPO.sol";

contract IPIPOTest is Test {
    IPIPO public ipipo;
    
    address public owner;
    address public creator;
    address public buyer;
    address public feeRecipient;
    
    string constant BASE_URI = "https://ipipo.app/api/metadata/";
    string constant META_URI = "QmTestHash123";
    
    function setUp() public {
        owner = address(this);
        creator = makeAddr("creator");
        buyer = makeAddr("buyer");
        feeRecipient = makeAddr("feeRecipient");
        
        // Deploy contract
        ipipo = new IPIPO(BASE_URI, feeRecipient);
        
        // Give test accounts some ETH
        vm.deal(creator, 10 ether);
        vm.deal(buyer, 10 ether);
    }
    
    function test_Deployment() public view {
        assertEq(ipipo.owner(), owner);
        assertEq(ipipo.feeRecipient(), feeRecipient);
        assertEq(ipipo.platformFee(), 250); // 2.5%
        assertEq(ipipo.getNextCampaignId(), 1);
    }
    
    function test_CreateCampaign() public {
        vm.prank(creator);
        
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Tweet Campaign",
            "Test description for tweet campaign",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        assertEq(campaignId, 1);
        
        // Check campaign data
        (
            uint256 id,
            address campaignCreator,
            string memory creatorHandle,
            IPIPO.CampaignKind kind,
            string memory name,
            string memory description,
            uint256 basePrice,
            uint256 priceStep,
            uint256 supply,
            uint256 sold,
            bool paused,
            uint256 createdAt,
            string memory metaURI
        ) = ipipo.campaigns(campaignId);
        
        assertEq(id, 1);
        assertEq(campaignCreator, creator);
        assertEq(creatorHandle, "@testcreator");
        assertEq(uint256(kind), uint256(IPIPO.CampaignKind.Tweet));
        assertEq(name, "Test Tweet Campaign");
        assertEq(description, "Test description for tweet campaign");
        assertEq(basePrice, 0.1 ether);
        assertEq(priceStep, 0);
        assertEq(supply, 100);
        assertEq(sold, 0);
        assertEq(paused, false);
        assertGt(createdAt, 0);
        assertEq(metaURI, META_URI);
    }
    
    function test_PurchaseVouchers() public {
        // First create a campaign
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        // Purchase vouchers
        vm.prank(buyer);
        ipipo.purchaseVouchers{value: 0.5 ether}(campaignId, 5);
        
        // Check buyer balance
        assertEq(ipipo.balanceOf(buyer, campaignId), 5);
        
        // Check campaign sold count
        (, , , , , , , , , uint256 sold, , , ) = ipipo.campaigns(campaignId);
        assertEq(sold, 5);
        
        // Check contract balance
        assertEq(address(ipipo).balance, 0.5 ether);
    }
    
    function test_PurchaseWithExcessPayment() public {
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        uint256 buyerBalanceBefore = buyer.balance;
        
        // Send more than required
        vm.prank(buyer);
        ipipo.purchaseVouchers{value: 1 ether}(campaignId, 5); // Should cost 0.5 ether
        
        // Check buyer got refund
        assertEq(buyer.balance, buyerBalanceBefore - 0.5 ether);
        assertEq(ipipo.balanceOf(buyer, campaignId), 5);
    }
    
    function test_RedeemVoucher() public {
        // Setup: Create campaign and purchase vouchers
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        vm.prank(buyer);
        ipipo.purchaseVouchers{value: 0.1 ether}(campaignId, 1);
        
        // Redeem voucher
        string memory proofURL = "https://x.com/testuser/status/123456";
        
        vm.prank(buyer);
        ipipo.redeemVoucher(campaignId, proofURL);
        
        // Check voucher was burned
        assertEq(ipipo.balanceOf(buyer, campaignId), 0);
        
        // Check redemption record
        (
            uint256 redemptionId,
            uint256 redemptionCampaignId,
            address redeemer,
            string memory redemptionProofURL,
            IPIPO.RedemptionStatus status,
            uint256 timestamp
        ) = ipipo.redemptions(1);
        
        assertEq(redemptionId, 1);
        assertEq(redemptionCampaignId, campaignId);
        assertEq(redeemer, buyer);
        assertEq(redemptionProofURL, proofURL);
        assertEq(uint256(status), uint256(IPIPO.RedemptionStatus.Completed));
        assertGt(timestamp, 0);
    }
    
    function test_WithdrawProceeds() public {
        // Setup: Create campaign and purchase vouchers
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        vm.prank(buyer);
        ipipo.purchaseVouchers{value: 1 ether}(campaignId, 10); // 1 ETH total revenue
        
        uint256 creatorBalanceBefore = creator.balance;
        uint256 feeRecipientBalanceBefore = feeRecipient.balance;
        
        // Withdraw proceeds
        vm.prank(creator);
        ipipo.withdrawProceeds(campaignId);
        
        // Calculate expected amounts
        uint256 totalRevenue = 1 ether;
        uint256 platformFeeAmount = (totalRevenue * 250) / 10000; // 2.5%
        uint256 creatorAmount = totalRevenue - platformFeeAmount;
        
        // Check balances
        assertEq(creator.balance, creatorBalanceBefore + creatorAmount);
        assertEq(feeRecipient.balance, feeRecipientBalanceBefore + platformFeeAmount);
        
        // Check sold count reset
        (, , , , , , , , , uint256 sold, , , ) = ipipo.campaigns(campaignId);
        assertEq(sold, 0);
    }
    
    function test_PauseCampaign() public {
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        // Pause campaign
        vm.prank(creator);
        ipipo.setCampaignPaused(campaignId, true);
        
        // Check paused status
        (, , , , , , , , , , bool paused, , ) = ipipo.campaigns(campaignId);
        assertEq(paused, true);
        
        // Try to purchase while paused (should fail)
        vm.prank(buyer);
        vm.expectRevert("Campaign is paused");
        ipipo.purchaseVouchers{value: 0.1 ether}(campaignId, 1);
    }
    
    function test_GetCampaignStatus() public {
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            2, // Small supply for testing
            META_URI
        );
        
        // Should be Active initially
        assertEq(uint256(ipipo.getCampaignStatus(campaignId)), uint256(IPIPO.CampaignStatus.Active));
        
        // Purchase all vouchers
        vm.prank(buyer);
        ipipo.purchaseVouchers{value: 0.2 ether}(campaignId, 2);
        
        // Should be SoldOut
        assertEq(uint256(ipipo.getCampaignStatus(campaignId)), uint256(IPIPO.CampaignStatus.SoldOut));
    }
    
    function test_GetCampaignsByCreator() public {
        vm.startPrank(creator);
        
        uint256 campaignId1 = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Campaign 1",
            "Description 1",
            "@creator",
            0.1 ether,
            100,
            META_URI
        );
        
        uint256 campaignId2 = ipipo.createCampaign(
            IPIPO.CampaignKind.Quote,
            "Campaign 2",
            "Description 2",
            "@creator",
            0.2 ether,
            50,
            META_URI
        );
        
        vm.stopPrank();
        
        uint256[] memory creatorCampaigns = ipipo.getCampaignsByCreator(creator);
        
        assertEq(creatorCampaigns.length, 2);
        assertEq(creatorCampaigns[0], campaignId1);
        assertEq(creatorCampaigns[1], campaignId2);
    }
    
    // Test revert cases
    function test_RevertInvalidCampaign() public {
        vm.prank(buyer);
        vm.expectRevert("Campaign does not exist");
        ipipo.purchaseVouchers{value: 0.1 ether}(999, 1);
    }
    
    function test_RevertInsufficientPayment() public {
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        vm.prank(buyer);
        vm.expectRevert("Insufficient payment");
        ipipo.purchaseVouchers{value: 0.05 ether}(campaignId, 1);
    }
    
    function test_RevertNotEnoughVouchers() public {
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            10, // Small supply
            META_URI
        );
        
        vm.prank(buyer);
        vm.expectRevert("Not enough vouchers available");
        ipipo.purchaseVouchers{value: 2 ether}(campaignId, 20);
    }
    
    function test_RevertNoVouchersToRedeem() public {
        vm.prank(creator);
        uint256 campaignId = ipipo.createCampaign(
            IPIPO.CampaignKind.Tweet,
            "Test Campaign",
            "Test description",
            "@testcreator",
            0.1 ether,
            100,
            META_URI
        );
        
        vm.prank(buyer);
        vm.expectRevert("No vouchers to redeem");
        ipipo.redeemVoucher(campaignId, "https://x.com/test/status/123");
    }
}
