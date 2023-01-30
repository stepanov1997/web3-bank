pragma solidity ^0.8.17;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

contract Swap {
    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public constant WETH9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address public constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    constructor() {}

    function swapExactInputSingle(uint amountIn) public returns (uint amountOut) {
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params;
        params.tokenIn = WETH9;
        params.tokenOut = DAI;
        params.fee = 3000;
        params.recipient = msg.sender;
        params.deadline = block.timestamp;
        params.amountIn = amountIn;
        params.amountOutMinimum = 0;
        params.sqrtPriceLimitX96 = 0;

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint amountOut, uint amountInMaximum) public returns (uint amountIn) {
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountInMaximum);
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params;
        params.tokenIn = WETH9;
        params.tokenOut = DAI;
        params.fee = 3000;
        params.recipient = msg.sender;
        params.deadline = block.timestamp;
        params.amountOut = amountOut;
        params.amountInMaximum = amountInMaximum;
        params.sqrtPriceLimitX96 = 0;

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(WETH9, address(swapRouter), 0);
            TransferHelper.safeTransfer(WETH9, msg.sender, amountInMaximum - amountIn);
        }
    }

    function swapExactInputMultihop(uint amountIn) public returns (uint amountOut) {
        TransferHelper.safeTransferFrom(WETH9, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(WETH9, address(swapRouter), amountIn);
        ISwapRouter.ExactInputSingleParams memory params;
        params.tokenIn = USDC;
        params.tokenOut = DAI;
        params.fee = 3000;
        params.recipient = msg.sender;
        params.deadline = block.timestamp;
        params.amountIn = amountIn;
        params.amountOutMinimum = 0;
        params.sqrtPriceLimitX96 = 0;

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputMultihop(uint amountOut, uint amountInMaximum) public returns (uint amountIn) {
        TransferHelper.safeTransferFrom(USDC, msg.sender, address(this), amountInMaximum);
        TransferHelper.safeApprove(USDC, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params;
        params.tokenIn = USDC;
        params.tokenOut = DAI;
        params.fee = 3000;
        params.recipient = msg.sender;
        params.deadline = block.timestamp;
        params.amountOut = amountOut;
        params.amountInMaximum = amountInMaximum;
        params.sqrtPriceLimitX96 = 0;

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(USDC, address(swapRouter), 0);
            TransferHelper.safeTransfer(USDC, msg.sender, amountInMaximum - amountIn);
        }
    }
}
